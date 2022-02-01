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

    return { code };
  };

  validateOTP = async ({ identity, type, otp }) => {
    const validOTP = await this.model.findOne({
      where: {
        code: otp,
        identity,
        type,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    return !!validOTP;
  };

  generateLinkCode = async ({ identity }) => {
    console.log('\n🟧 generateLinkCode()');
    const type = 'LINK_CODE';

    const existingCode = await this.model.findOne({
      where: {
        identity,
        type,
      },
    });

    if (existingCode) {
      const alreadyClaimed = existingCode.openIdIdentityId;
      const expired = moment().isAfter(moment(existingCode.expiresAt));

      if (alreadyClaimed || !expired) {
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

  getLinkCodeByOtp = async ({ otp }) => {
    return this.model.findOne({
      where: {
        code: otp,
        type: 'LINK_CODE',
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });
  };

  claimLinkCode = async ({ otp, openIdIdentity }) => {
    console.log('\n🟧 claimLinkCode() ', otp, openIdIdentity);
    const otpRow = await this.model.findOne({
      otp,
    });

    try {
      const updatedOtpRow = await otpRow.update({
        openIdIdentityId: openIdIdentity.id,
      });

      return updatedOtpRow;
    } catch (err) {
      throw new Error('Unable to claim link code');
    }
  };
}
