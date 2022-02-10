/* eslint-disable import/named */
import * as OTP from '..';
import OTPDataSource from '../data-source';
import { getSequelize } from '../../postgres/index';
import { setupPostgresTestEnv } from '../../utils/testUtils';
import {
  Campus,
  ContentItem,
  ContentItemCategory,
  Person,
  Media,
} from '../../index';

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

    await setupPostgresTestEnv(
      [Campus, ContentItem, ContentItemCategory, OTP, Person, Media],
      context
    );

    otpDataSource = new OTPDataSource();
    await otpDataSource.initialize({ context });
  });

  afterEach(async () => {
    await globalSequelize.drop({ cascade: true });
    await sequelize.drop({ cascade: true });
  });

  it('generates an otp for email', async () => {
    const { code } = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    await otpDataSource.model.findOne({
      where: {
        code,
      },
    });

    expect(code).toMatch(/[0-9]{6}/);
  });

  it('generates an otp for phone number', async () => {
    const { code } = await otpDataSource.generateOTP({
      identity: '11231231234',
      type: 'PHONE',
    });

    expect(code).toMatch(/[0-9]{6}/);
  });

  it('validates an otp for email', async () => {
    const { code } = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    const isValidOTP = await otpDataSource.validateOTP({
      identity: '123@123.com',
      code,
    });

    expect(isValidOTP).toBe(true);
  });

  it('validates an otp for phone', async () => {
    const { code } = await otpDataSource.generateOTP({
      identity: '11231231234',
      type: 'PHONE',
    });

    const isValidOTP = await otpDataSource.validateOTP({
      identity: '11231231234',
      code,
    });

    expect(isValidOTP).toBe(true);
  });

  it('rejects an invalid otp', async () => {
    const { code } = await otpDataSource.generateOTP({
      identity: '11231231234',
      type: 'PHONE',
    });

    const isValidOTP = await otpDataSource.validateOTP({
      identity: '11231231234',
      code: String(parseInt(code, 10) + 1),
    });

    expect(isValidOTP).toBe(false);
  });

  it('rejects an invalid identity', async () => {
    const { code } = await otpDataSource.generateOTP({
      identity: '11231231234',
      type: 'PHONE',
    });

    const isValidOTP = await otpDataSource.validateOTP({
      identity: '123@123.com',
      code,
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
    const { code: code1 } = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    await otpDataSource.model.findOne({
      where: {
        code: code1,
      },
    });

    expect(code1).toMatch(/[0-9]{6}/);

    const { code: code2 } = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    expect(code2).toEqual(code1);
  });

  it('should return a new code, if existing codes are expired', async () => {
    const { code: code1 } = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    await otpDataSource.model.findOne({
      where: {
        code: code1,
      },
    });

    expect(code1).toMatch(/[0-9]{6}/);

    await otpDataSource.model.update(
      {
        expiresAt: new Date(),
      },
      {
        where: {
          code: code1,
        },
      }
    );

    const { code: code2 } = await otpDataSource.generateOTP({
      identity: '123@123.com',
      type: 'EMAIL',
    });

    expect(code2).not.toEqual(code1);
  });
});
