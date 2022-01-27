import cryptoRandomString from 'crypto-random-string';
import moment from 'moment';
import { Op } from 'sequelize';

import { PostgresDataSource } from '../postgres';

export default class OTPDataSource extends PostgresDataSource {
  modelName = 'otp';

  generateOTP = async ({ identity, type }) => {
    if (type === 'LINK_CODE') {
      return this.generateLinkCode({ identity, type });
    }

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

  generateLinkCode = async ({ identity, type }) => {
    console.log('\ngenerateLinkCode()');
    console.log('identity:', identity);
    console.log('type:', type);

    // Is there already a linkCode for this clientId?
    // --> Has the link code already been claimed?
    //    --> LINK_CODE_CLAIMED
    // --> Has the link code expired?
    //    --> YES: Generate a new one
    //    --> NO: Return the existing one

    const existingCode = await this.model.findOne({
      where: {
        identity,
        type,
      },
    });

    // console.log('existingCode:', existingCode);

    if (existingCode) {
      if (moment().isBefore(moment(existingCode.expiresAt))) {
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

    await this.model.create(otpShape);

    return otpShape;
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
    console.log('openIdIdentity.id:', openIdIdentity.id);
    const rkd = await this.model.findOne({
      otp,
    });
    console.log('rkd:', rkd);
    const [count, results] = await this.model.update(
      {
        openIdIdentityId: openIdIdentity.id,
      },
      {
        where: {
          otp,
        },
        returning: true,
      }
    );

    console.log('results:', results);
    if (count < 1) {
      throw new Error('Unable to claim link code');
    }

    return results[0];
  };
}
