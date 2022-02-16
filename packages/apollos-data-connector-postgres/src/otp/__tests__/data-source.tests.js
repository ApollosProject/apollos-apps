/* eslint-disable import/named */
import * as OTP from '..';
import OTPDataSource from '../data-source';
import { getSequelize } from '../../postgres/index';
import { setupPostgresTestEnv } from '../../utils/testUtils';

const context = {
  church: { slug: 'apollos_demo' },
};

describe('Apollos Postgres OTP DataSource', () => {
  let otpDataSource;
  let globalSequelize;
  let sequelize;

  beforeEach(async () => {
    globalSequelize = await getSequelize({ churchSlug: 'global' });
    sequelize = await getSequelize({ churchSlug: 'apollos_demo' });

    await setupPostgresTestEnv([OTP], context);

    otpDataSource = new OTPDataSource();
    await otpDataSource.initialize({ context });
  });

  afterEach(async () => {
    await globalSequelize.truncate({ cascade: true });
    await sequelize.truncate({ cascade: true });
  });

  it('generates an otp for email', async () => {
    const otp = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    await otpDataSource.model.findOne({
      where: {
        code: otp,
      },
    });

    expect(otp).toMatch(/[0-9]{6}/);
  });

  it('generates an otp for phone number', async () => {
    const otp = await otpDataSource.generateOTP({
      identity: '11231231234',
      type: 'PHONE',
    });

    expect(otp).toMatch(/[0-9]{6}/);
  });

  it('validates an otp for email', async () => {
    const otp = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    const isValidOTP = await otpDataSource.validateOTP({
      identity: '123@123.com',
      otp,
    });

    expect(isValidOTP).toBe(true);
  });

  it('validates an otp for phone', async () => {
    const otp = await otpDataSource.generateOTP({
      identity: '11231231234',
      type: 'PHONE',
    });

    const isValidOTP = await otpDataSource.validateOTP({
      identity: '11231231234',
      otp,
    });

    expect(isValidOTP).toBe(true);
  });

  it('rejects an invalid otp', async () => {
    const otp = await otpDataSource.generateOTP({
      identity: '11231231234',
      type: 'PHONE',
    });

    const isValidOTP = await otpDataSource.validateOTP({
      identity: '11231231234',
      otp: String(parseInt(otp, 10) + 1),
    });

    expect(isValidOTP).toBe(false);
  });

  it('rejects an invalid identity', async () => {
    const otp = await otpDataSource.generateOTP({
      identity: '11231231234',
      type: 'PHONE',
    });

    const isValidOTP = await otpDataSource.validateOTP({
      identity: '123@123.com',
      otp,
    });

    expect(isValidOTP).toBe(false);
  });

  it('rejects an improperly formatted identity', async () => {
    let errorCount = 0;
    try {
      await otpDataSource.generateOTP({
        identity: '+11231231234',
        type: 'PHONE',
      });
    } catch (e) {
      errorCount += 1;
      expect(e).not.toBeNull();
    }

    try {
      await otpDataSource.generateOTP({
        identity: '123.123',
        type: 'EMAIL',
      });
    } catch (e) {
      errorCount += 1;
      expect(e).not.toBeNull();
    }

    expect(errorCount).toEqual(2);
  });

  it('should return an existing code, if it is not expired', async () => {
    const otp1 = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    await otpDataSource.model.findOne({
      where: {
        code: otp1,
      },
    });

    expect(otp1).toMatch(/[0-9]{6}/);

    const otp2 = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    expect(otp2).toEqual(otp1);
  });

  it('should return a new code, if existing codes are expired', async () => {
    const otp1 = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    await otpDataSource.model.findOne({
      where: {
        code: otp1,
      },
    });

    expect(otp1).toMatch(/[0-9]{6}/);

    await otpDataSource.model.update(
      {
        expiresAt: new Date(),
      },
      {
        where: {
          code: otp1,
        },
      }
    );

    const otp2 = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    expect(otp2).not.toEqual(otp1);
  });
});
