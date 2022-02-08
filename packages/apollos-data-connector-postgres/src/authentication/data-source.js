import { AuthenticationError, UserInputError } from 'apollo-server';
import { generateAppLink } from '@apollosproject/server-core';
import { isNil, mapValues, omit, startCase, toLower, toUpper } from 'lodash';
import { Op } from 'sequelize';

import { PostgresDataSource } from '../postgres';
import { phoneToDB } from '../utils/phone';
import { generateToken } from './token';

export default class AuthenticationDataSource extends PostgresDataSource {
  // eslint-disable-next-line class-methods-use-this
  parseIdentity(identity) {
    // Link Code for connecting a device
    if (identity.clientId) {
      return { identityKey: 'link_code', identityValue: identity.clientId };
    }

    // Phone and Email
    const identityFieldSelect = mapValues(omit(identity, isNil), (v) =>
      toLower(v)
    );

    // Cleans the phone number, if it's present
    if (identityFieldSelect.phone) {
      identityFieldSelect.phone = phoneToDB({
        number: identityFieldSelect.phone,
      });
    }

    const identityKey = Object.keys(identityFieldSelect)[0];
    const identityValue = Object.values(identityFieldSelect)[0];

    return { identityKey, identityValue };
  }

  async requestRegister({ identity }) {
    const { identityKey, identityValue } = this.parseIdentity(identity);

    const existingPerson = await this.sequelize.models.people.findOne({
      where: {
        [identityKey]: {
          [Op.iLike]: identityValue,
        },
      },
    });

    if (existingPerson) {
      return {
        result: 'EXISTING_USER',
      };
    }

    const person = await this.sequelize.models.people.create({
      apollosUser: true,
      [identityKey]: identityValue,
    });

    return this.sendOtpForRequest({ identityValue, identityKey, person });
  }

  async requestLogin({ identity }) {
    const { identityKey, identityValue } = this.parseIdentity(identity);

    const person = await this.sequelize.models.people.findOne({
      where: {
        [identityKey]: {
          [Op.iLike]: identityValue,
        },
      },
    });

    if (!person) {
      return {
        result: 'NO_USER',
      };
    }

    return this.sendOtpForRequest({ identityValue, identityKey, person });
  }

  async sendOtpForRequest({ identityValue, identityKey }) {
    const code = await this.context.dataSources.OTP.generateOTP({
      identity: identityValue,
      type: toUpper(identityKey),
    });

    if (identityKey === 'phone') {
      await this.context.dataSources.Sms.sendSms({
        body: `Your code to login is: ${code}`,
        to: identityValue,
      });
    } else if (identityKey === 'email') {
      const url = generateAppLink(
        'deep',
        'auth',
        {
          query: `?identity=${identityValue}&authType=${identityKey}&code=${code}`,
        },
        this.context.dataSources.Config
      );

      const churchName = startCase(this.context.church.slug);
      await this.context.dataSources.Email.sendEmail({
        toEmail: identityValue,
        fromName: `${churchName} App`,
        subject: `${churchName}: Login Code: ${code}`,
        html: `
          <p>Your login code for ${churchName} is below.</p>
          <p>Want to skip the typing? If you're viewing this email on the same device you are trying to login on, <strong><a href="${url}">tap here to login automatically.</a></strong></p>
          <p>Your code is: <strong>${code}</strong></p>
        `,
      });
    }

    return {
      result: 'SUCCESS',
    };
  }

  async validateLogin({ identity, otp }) {
    const { OTP, RefreshToken } = this.context.dataSources;

    const { identityKey, identityValue } = this.parseIdentity(identity);

    const isValid = await OTP.validateOTP({
      identity: identityValue,
      type: toUpper(identityKey),
      otp,
    });

    if (!isValid) {
      throw new UserInputError('Invalid OTP');
    }

    const person = await this.sequelize.models.people.findOne({
      where: {
        [identityKey]: {
          [Op.iLike]: identityValue,
        },
      },
    });

    if (!person) {
      // eslint-disable-next-line no-console
      console.error('No user found');
      return null;
    }

    const accessToken = generateToken({ personId: person.id });
    const refreshToken = await RefreshToken.createToken({
      personId: person.id,
    });

    return {
      person,
      accessToken,
      refreshToken,
    };
  }

  async requestLinkCode({ input }) {
    console.log('\n🟪 🔐 Authentication.requestLinkCode() ');
    console.log('input:', input);

    const { identityKey, identityValue } = this.parseIdentity(input);

    if (identityKey !== 'link_code') {
      return {
        result: 'ERROR',
      };
    }

    return this.sendLinkCodeForRequest({ identityValue, identityKey });
  }

  async sendLinkCodeForRequest({ identityValue }) {
    console.log('\n🟪 sendLinkCodeForRequest()');

    const linkCode = await this.context.dataSources.OTP.generateLinkCode({
      identity: identityValue,
    });

    let result = 'SUCCESS';
    let authenticatedPerson = null;

    if (linkCode.openIdIdentityId) {
      const openIdIdentity = await linkCode.getOpenIdIdentity();

      if (!openIdIdentity) {
        result = 'USER_NOT_FOUND';
      } else {
        const person = await openIdIdentity.getPerson();

        if (!person) {
          result = 'USER_NOT_FOUND';
        } else {
          authenticatedPerson = {
            person,
            accessToken: openIdIdentity.accessToken,
            refreshToken: openIdIdentity.refreshToken,
          };
        }
      }
    }

    return {
      result,
      otp: linkCode.code,
      expiresAt: linkCode.expiresAt,
      authenticatedPerson,
    };
  }

  claimLinkCode = async ({ input }) => {
    console.log('\n🟪 🔐 Authentication.claimLinkCode()');
    const { OTP } = this.context.dataSources;

    // Make sure it's a valid code first
    const linkCode = await OTP.getLinkCodeByOtp({
      otp: input.otp,
    });
    const isValid = !!linkCode;
    const isClaimed = !!linkCode?.openIdIdentityId;

    if (!isValid || isClaimed) {
      return {
        result: 'INVALID_LINK_CODE',
      };
    }

    // Ensure a Person exists
    const { originPerson } = input;

    let person = await this.sequelize.models.people.findOne({
      where: {
        originId: originPerson.originId,
      },
    });

    if (!person) {
      const personAttributes = {
        originId: originPerson.originId,
        originType: originPerson.originType,
        firstName: originPerson.firstName,
        lastName: originPerson.lastName,
        email: originPerson.email,
        phone: originPerson.phone,
      };

      person = await this.sequelize.models.people.create(personAttributes);
    }

    // Ensure an OpenIdIdentity exists
    let openIdIdentity = await this.sequelize.models.openIdIdentity.findOne({
      where: {
        personId: person.id,
      },
    });

    if (!openIdIdentity) {
      const openIdAttributes = {
        personId: person.id,
        accessToken: input.openIdIdentity.accessToken,
        refreshToken: input.openIdIdentity.refreshToken,
        providerType: input.openIdIdentity.providerType,
        providerSessionId: input.openIdIdentity.providerSessionId,
      };

      openIdIdentity = await this.sequelize.models.openIdIdentity.create(
        openIdAttributes
      );
    }

    // Claim the OTP using the OpenID
    try {
      await OTP.claimLinkCode({
        otp: input.otp,
        openIdIdentity,
      });
    } catch (otpUpdateError) {
      // eslint-disable-next-line no-console
      console.error(otpUpdateError);

      return {
        result: 'ERROR',
      };
    }

    return {
      result: 'SUCCESS',
    };
  };

  async requestConnectIdentity({ identity }) {
    const { identityKey, identityValue } = this.parseIdentity(identity);

    const person = await this.context.dataSources.Person.getCurrentPerson();

    return this.sendOtpForRequest({ identityValue, identityKey, person });
  }

  async connectIdentity({ identity, otp }) {
    const { OTP, Person } = this.context.dataSources;

    const { identityKey, identityValue } = this.parseIdentity(identity);

    const isValid = await OTP.validateOTP({
      identity: identityValue,
      otp,
    });

    if (!isValid) {
      throw new UserInputError('Invalid OTP');
    }

    const person = await Person.getCurrentPerson();

    await person.update({
      [identityKey]: identityValue,
    });

    return {
      person,
    };
  }

  refreshSession = async ({ refreshToken }) => {
    // Find and validate refresh token
    const token = await this.context.dataSources.RefreshToken.getValidToken({
      jwtToken: refreshToken,
    });
    // Create new person token
    const accessToken = generateToken({ personId: token.personId });
    // Return both refresh token and person token
    return {
      accessToken,
      refreshToken,
    };
  };

  getCurrentPerson = async () => {
    const { personId } = this.context;

    if (personId) {
      // Delegate to Person model.
      return { profile: this.context.dataSources.Person.getCurrentPerson() };
    }
    throw new AuthenticationError('Must be logged in');
  };
}
