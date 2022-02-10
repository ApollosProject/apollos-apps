import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';
import { Op } from 'sequelize';

import { PostgresDataSource } from '../postgres';

export default class OTPDataSource extends PostgresDataSource {
  modelName = 'otp';

  // Handles PHONE and EMAIL types
  generateOTP = async ({ identity, type }) => {
    const matches = identity.match(
      /(^1[0-9]{10})|([^@\s]+@[^@\s.]+\.[^@\s.]+)$/
    );

    if (!matches) {
      throw new Error('Invalid identity');
    }

    const existingCode = await this.model.findOne({
      where: {
        identity,
        type,
      },
    });

    if (existingCode) {
      if (moment().isBefore(moment(existingCode.expiresAt))) {
        return existingCode;
      }

      this.model.destroy({
        where: {
          identity,
        },
      });
    }

    const tomorrow = moment().add(1, 'day').toDate();
    const code = cryptoRandomString({ length: 6, type: 'numeric' });
    const otpShape = {
      code,
      identity,
      type,
      expiresAt: tomorrow,
      apollosType: 'OTP',
    };

    await this.model.create(otpShape);

    return otpShape;
  };

  validateOTP = async ({ identity, code }) => {
    const validOTP = await this.model.findOne({
      where: {
        code,
        identity,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    return !!validOTP;
  };

  generateLinkCode = async ({ identity }) => {
    const type = 'LINK_CODE';

    const existingCode = await this.model.findOne({
      where: {
        identity,
        type,
      },
    });

    if (existingCode) {
      const claimed = existingCode.personId;
      const expired = moment().isAfter(moment(existingCode.expiresAt));

      if (claimed || !expired) {
        return existingCode;
      }

      this.model.destroy({
        where: {
          identity,
          type,
        },
      });
    }

    const fiveMinutesFromNow = moment().add(5, 'minutes').toDate();
    const code = cryptoRandomString({ length: 4, type: 'numeric' });
    const otpShape = {
      code,
      identity,
      type,
      expiresAt: fiveMinutesFromNow,
      apollosType: 'OTP',
    };

    const newOtp = await this.model.create(otpShape);

    return newOtp;
  };

  getLinkCodeByCode = async ({ code }) => {
    return this.model.findOne({
      where: {
        code,
        type: 'LINK_CODE',
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });
  };

  claimLinkCode = async ({ code, person }) => {
    const otpRow = await this.model.findOne({
      where: {
        code,
        personId: null,
      },
    });

    try {
      const updatedOtpRow = await otpRow.update({
        personId: person.id,
      });

      return updatedOtpRow;
    } catch (err) {
      throw new Error('Unable to claim link code');
    }
  };
}
