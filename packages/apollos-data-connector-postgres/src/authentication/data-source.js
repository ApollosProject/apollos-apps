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
    const { OTP } = this.context.dataSources;

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

    return this.createAuthenticatedPerson({ person });
  }

  async requestLinkCode({ input }) {
    console.log('\n🔑 (Data Source) Authentication.requestLinkCode() ');
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
    const { OTP } = this.context.dataSources;

    const linkCode = await OTP.generateLinkCode({
      identity: identityValue,
    });

    let result = 'SUCCESS';
    let authenticatedPerson = null;

    if (linkCode.personId) {
      const person = await linkCode.getPerson();

      if (person) {
        authenticatedPerson = this.createAuthenticatedPerson({ person });
      } else {
        result = 'USER_NOT_FOUND';
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
    console.log('\n🔑 (Data Source) Authentication.claimLinkCode()');
    const { OTP, Person } = this.context.dataSources;

    // Validate link code OTP is valid
    const linkCode = await OTP.getLinkCodeByCode({
      code: input.code,
    });
    const isValid = Boolean(linkCode);
    const isClaimed = Boolean(linkCode?.personId);

    if (!isValid || isClaimed) {
      return {
        result: 'INVALID_LINK_CODE',
      };
    }

    // Validate the user requesting to claim the code
    const person = await Person.getCurrentPerson();

    // Claim the Link Code/OTP
    try {
      await OTP.claimLinkCode({
        code: input.code,
        person,
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

  // NEXT STEPS 2/8 3:30pm:
  // --> Check slack with Vincent, but need to refactor these token generation
  // things into a central mechanism, so I can return them in the requestLinkCode flow

  getCurrentPerson = async () => {
    const { personId } = this.context;

    if (personId) {
      // Delegate to Person model.
      return { profile: this.context.dataSources.Person.getCurrentPerson() };
    }
    throw new AuthenticationError('Must be logged in');
  };

  createAuthenticatedPerson = async ({ person }) => {
    const accessToken = generateToken({ personId: person.id });
    const refreshToken = await this.context.dataSources.RefreshToken.createToken(
      {
        personId: person.id,
      }
    );

    return {
      person,
      accessToken,
      refreshToken,
    };
  };
}
