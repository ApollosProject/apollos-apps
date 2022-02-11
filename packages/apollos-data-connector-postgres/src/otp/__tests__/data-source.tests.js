/* eslint-disable import/named */
import * as OTP from '..';
import { getSequelize } from '../../postgres/index';
import { setupPostgresTestEnv } from '../../utils/testUtils';

import OTPDataSource from '../data-source';
import PersonDataSource from '../../people/dataSource';
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
  let personDataSource;
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

    personDataSource = new PersonDataSource();
    await personDataSource.initialize({ context });
  });

  afterEach(async () => {
    await globalSequelize.drop({ cascade: true });
    await sequelize.drop({ cascade: true });
  });

  describe('generateOTP', () => {
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

  describe('validateOTP', () => {
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
  });

  describe('generateLinkCode', () => {
    it('should create a new link code otp if one does not exist', async () => {
      const otp = await otpDataSource.generateLinkCode({ identity: 'cocoa' });

      expect(otp).toMatchObject({
        id: expect.any(String),
        code: expect.any(String),
        identity: 'cocoa',
        type: 'LINK_CODE',
      });

      // Expiration date should be in the future
      const expiresAtTime = new Date(otp.expiresAt).getTime();
      const nowTime = new Date().getTime();
      expect(expiresAtTime).toBeGreaterThan(nowTime);
    });

    it('should regenerate an expired link code otp', async () => {
      const input = { identity: 'lentil' };

      const expiredOtp = await otpDataSource.generateLinkCode(input);
      await expiredOtp.update({
        expiresAt: '1989-01-15T21:12:00.000Z',
      });

      const refreshedOtp = await otpDataSource.generateLinkCode(input);

      expect(expiredOtp.code).not.toBe(refreshedOtp.code); // New code
      expect(expiredOtp.identity).toBe(refreshedOtp.identity); // Same identity
      expect(expiredOtp.type).toBe(refreshedOtp.type); // Same type

      // Refreshed OTP should expire in the future
      const expiresAtTime = new Date(refreshedOtp.expiresAt).getTime();
      const nowTime = new Date().getTime();
      expect(expiresAtTime).toBeGreaterThan(nowTime);
    });

    it('should return an existing link code otp if it is claimed already', async () => {
      const ryan = await personDataSource.model.create({
        originId: '2112',
        originType: 'rock',
        firstName: 'Ryan',
        lastName: 'Davidson',
      });

      const input = { identity: 'flax' };

      // Generate a link code
      const firstOtp = await otpDataSource.generateLinkCode(input);

      // Force claim it via direct DB query
      await firstOtp.update({
        personId: ryan.id,
      });

      // Second invocation should return the same code as the first
      const secondOtp = await otpDataSource.generateLinkCode(input);

      expect(secondOtp.dataValues).toMatchObject(firstOtp.dataValues);
    });

    it('should return an existing link code otp if it has not expired', async () => {
      const input = { identity: 'flax' };

      // Generate the same link code back-to-back
      const firstOtp = await otpDataSource.generateLinkCode(input);
      const secondOtp = await otpDataSource.generateLinkCode(input);

      expect(firstOtp.dataValues).toMatchObject(secondOtp.dataValues);
    });
  });

  describe('getLinkCodeByCode', () => {
    it('should return a link code if it has not expired yet', async () => {
      const otp = await otpDataSource.generateLinkCode({ identity: 'almond' });
      const result = await otpDataSource.getLinkCodeByCode({ code: otp.code });

      expect(result.dataValues).toMatchObject(otp.dataValues);
    });

    it('should return null if no otp found with a given code', async () => {
      const result = await otpDataSource.getLinkCodeByCode({ code: 'XXXX' });
      expect(result).toBeNull();
    });

    it('should return null if the otp was found, but is expired', async () => {
      const input = { identity: 'banana' };

      // Create an expired OTP
      const otp = await otpDataSource.generateLinkCode(input);
      await otp.update({
        expiresAt: '1989-01-15T21:12:00.000Z',
      });

      const result = await otpDataSource.getLinkCodeByCode({ code: otp.code });
      expect(result).toBeNull();
    });
  });
});
