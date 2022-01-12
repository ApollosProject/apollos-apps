import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';
import { Op } from 'sequelize';

import { PostgresDataSource } from '../postgres';

export default class OTPDataSource extends PostgresDataSource {
  modelName = 'otp';

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
      },
    });
    if (existingCode) {
      if (moment().isBefore(moment(existingCode.expiresAt))) {
        return existingCode.code;
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

    return code;
  };

  validateOTP = async ({ identity, otp }) => {
    const validOTP = await this.model.findOne({
      where: {
        code: otp,
        identity,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    return !!validOTP;
  };
}
