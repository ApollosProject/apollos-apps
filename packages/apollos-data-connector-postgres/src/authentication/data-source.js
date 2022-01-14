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
    // Device OTP Case
    if (identity.deviceId) {
      return { identityKey: 'device_otp', identityValue: identity.deviceId };
    }

    // Phone and Email case
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
    const otp = await this.context.dataSources.OTP.generateOTP({
      identity: identityValue,
      type: toUpper(identityKey),
    });
    const { code } = otp;
    console.log('🔢 otp:', otp);

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
    } else if (identityKey === 'device_otp') {
      // Placeholder
      console.log('🔢 otp:', otp);
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

  // requestDeviceOTP = async ({ identity }) => {
  //   const { OTP } = this.context.dataSources;
  //   console.log('🟧 🔐 Authentication.requestDeviceOTP() ');
  //   console.log('identity:', identity);

  //   const deviceOtp = await OTP.generateDeviceOTP({ deviceId });

  //   return {
  //     result: 'SUCCESS',
  //   };
  // };

  async requestDeviceOTP({ identity }) {
    console.log('🟧 🔐 Authentication.requestDeviceOTP() ');
    console.log('identity:', identity);
    const { identityKey, identityValue } = this.parseIdentity(identity);
    console.log('identityKey:', identityKey);
    console.log('identityValue:', identityValue);
    return this.sendOtpForRequest({ identityValue, identityKey });
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
