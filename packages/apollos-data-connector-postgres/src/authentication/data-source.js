import { AuthenticationError } from 'apollo-server';
import { generateAppLink } from '@apollosproject/server-core';
import { isNil, mapValues, omit, toLower, toUpper } from 'lodash';
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

  async sendOtpForRequest({ identityValue, identityKey, person }) {
    console.log('\n🔑 sendOtpForRequest');
    const otp = await this.context.dataSources.OTP.generateOTP({
      identity: identityValue,
      type: toUpper(identityKey),
    });
    const { code } = otp;

    if (identityKey === 'phone') {
      await this.context.dataSources.Sms.sendSms({
        body: `Hi${
          person.firstName ? `, ${person.firstName}` : ''
        }!\n\nYour church would like to help you login. Your code is: ${code}`,
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
      await this.context.dataSources.Email.sendEmail({
        toEmail: identityValue,
        subject: 'Your One Time Login Password',
        html: `
          <p>Hi${person.firstName ? `, ${person.firstName}` : ''}!</p>
          <br>
          <p>Your church would like to help you login</p>
          <p>Your code is: <strong>${code}</strong>, or you can <strong><a href="${url}">click here</a></strong> with the app installed</p>
        `,
      });
    } else if (identityKey === 'link_code') {
      console.log('🔢 Link Code otp:', otp);
      return {
        result: 'SUCCESS',
        otp: otp.code,
        expiresAt: otp.expiresAt,
        authenticatedPerson: null,
      };
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
    });

    if (!isValid) {
      console.error('Invalid OTP');
      return null;
    }

    const person = await this.sequelize.models.people.findOne({
      where: {
        [identityKey]: {
          [Op.iLike]: identityValue,
        },
      },
    });

    if (!person) {
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
    console.log('\n🟧 🔐 Authentication.requestLinkCode() ');
    console.log('input:', input);

    console.log('👤 Parsing identity...');
    const { identityKey, identityValue } = this.parseIdentity(input);
    console.log('identityKey:', identityKey);
    console.log('identityValue:', identityValue);

    return this.sendOtpForRequest({ identityValue, identityKey });
  }

  claimLinkCode = async ({ input }) => {
    console.log('\n🟪 🔐 Authentication.claimLinkCode()');
    console.log('input:', input);
    const { OTP } = this.context.dataSources;

    // Make sure it's a valid code first
    const linkCode = await OTP.getLinkCodeByOtp({
      otp: input.otp,
    });
    const isValid = !!linkCode;
    const isClaimed = !!linkCode?.dataValues.open_id_identity_id;

    console.log('🔢 linkCode:', linkCode);
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
      console.log('🟪 👤 Creating new Person entry...', originPerson);

      const personAttributes = {
        originId: originPerson.originId,
        originType: originPerson.originType,
        firstName: originPerson.firstName,
        lastName: originPerson.lastName,
        email: originPerson.email,
        phone: originPerson.phone,
      };

      console.log('personAttributes:', personAttributes);
      person = await this.sequelize.models.people.create(personAttributes);
    }
    console.log('👤 person:', person);

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

      console.log('openIdAttributes:', openIdAttributes);
      openIdIdentity = await this.sequelize.models.openIdIdentity.create(
        openIdAttributes
      );
    }

    console.log('💳 openIdIdentity:', openIdIdentity);

    // Associated it to this OTP
    try {
      const result = await OTP.claimLinkCode({
        otp: input.otp,
        openIdIdentity,
      });
      console.log('(update OTP) result:', result);
    } catch (otpUpdateError) {
      console.error(otpUpdateError);
      return {
        result: 'ERROR',
      };
    }

    return {
      result: 'SUCCESS',
    };
  };

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
