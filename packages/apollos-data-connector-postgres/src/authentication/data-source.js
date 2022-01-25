import { AuthenticationError } from 'apollo-server';
import { generateAppLink } from '@apollosproject/server-core';
import { isNil, mapValues, omit, startCase, toLower, toUpper } from 'lodash';
import { Op } from 'sequelize';

import { PostgresDataSource } from '../postgres';
import { phoneToDB } from '../utils/phone';
import { generateToken } from './token';

export default class AuthenticationDataSource extends PostgresDataSource {
  // eslint-disable-next-line class-methods-use-this
  parseIdentity(identity) {
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
    const otp = await this.context.dataSources.OTP.generateOTP({
      identity: identityValue,
      type: toUpper(identityKey),
    });

    if (identityKey === 'phone') {
      await this.context.dataSources.Sms.sendSms({
        body: `Your code to login is: ${otp}`,
        to: identityValue,
      });
    } else {
      const url = generateAppLink(
        'deep',
        'auth',
        {
          query: `?identity=${identityValue}&authType=${identityKey}&code=${otp}`,
        },
        this.context.dataSources.Config
      );

      const churchName = startCase(this.context.church.slug);
      await this.context.dataSources.Email.sendEmail({
        toEmail: identityValue,
        fromName: `${churchName} App`,
        subject: `${churchName}: Login Code: ${otp}`,
        html: `
          <p>Your login code for ${churchName} is below.</p>
          <p>Want to skip the typing? If you're viewing this email on the same device you are trying to login on, <strong><a href="${url}">tap here to login automatically.</a></strong></p>
          <p>Your code is: <strong>${otp}</strong></p>
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
      otp,
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
