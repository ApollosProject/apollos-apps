/* eslint-disable import/named */
import {
  Authentication,
  Campus,
  ContentItem,
  ContentItemCategory,
  Media,
  OTP,
  Person,
  RefreshToken,
} from '../../index';
import { getSequelize } from '../../postgres/index';
import { setupPostgresTestEnv } from '../../utils/testUtils';
import { registerToken } from '../token';

const context = {
  church: { slug: 'apollos_demo' },
};

const PersonDataSource = Person.dataSource;
const OTPDataSource = OTP.dataSource;
const RefreshTokenDataSource = RefreshToken.dataSource;
const AuthenticationDataSource = Authentication.dataSource;

describe('Apollos Postgres Authentication DataSource', () => {
  let authenticationDataSource;
  let globalSequelize;
  let personDataSource;
  let otpDataSource;
  let refreshTokenDataSource;
  let sequelize;

  beforeEach(async () => {
    globalSequelize = getSequelize({ churchSlug: 'global' });
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });

    await setupPostgresTestEnv(
      [
        Person,
        Campus,
        ContentItemCategory,
        ContentItem,
        Media,
        OTP,
        RefreshToken,
        Authentication,
      ],
      context
    );

    authenticationDataSource = new AuthenticationDataSource();
    personDataSource = new PersonDataSource();
    otpDataSource = new OTPDataSource();
    refreshTokenDataSource = new RefreshTokenDataSource();

    await authenticationDataSource.initialize({ context });
    await personDataSource.initialize({ context });
    await otpDataSource.initialize({ context });
    await refreshTokenDataSource.initialize({ context });

    context.dataSources = {
      Person: personDataSource,
      OTP: otpDataSource,
      RefreshToken: refreshTokenDataSource,
      Sms: { sendSms: () => {} },
      Email: { sendEmail: () => {} },
      Config: {
        APP: {
          UNIVERSAL_LINK_HOST: 'https://server.app',
          DEEP_LINK_HOST: 'apollosapp://a',
        },
      },
    };
  });

  afterEach(async () => {
    await globalSequelize.drop({ cascade: true });
    await sequelize.drop({ cascade: true });
  });

  it('should return success on email login request', async () => {
    await personDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
      email: '123@123.123',
    });
    const msg = await authenticationDataSource.requestLogin({
      identity: {
        email: '123@123.123',
      },
    });
    expect(msg.result).toEqual('SUCCESS');
  });

  it('should return a person on successful email validate request', async () => {
    await personDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
      email: '123@123.123',
    });
    await authenticationDataSource.requestLogin({
      identity: {
        email: '123@123.123',
      },
    });

    const otp = await sequelize.models.otp.findOne({
      where: {
        identity: '123@123.123',
      },
    });

    const { person } = await authenticationDataSource.validateLogin({
      identity: {
        email: '123@123.123',
      },
      otp: otp.code,
    });

    expect(person.firstName).toEqual('Vincent');
  });

  it('should return success on phone login request', async () => {
    await personDataSource.model.create({
      originId: '2',
      originType: 'rock',
      firstName: 'Bill',
      lastName: 'Cheetler',
      phone: '15135555555',
    });

    const msg = await authenticationDataSource.requestLogin({
      identity: {
        phone: '15135555555',
      },
    });
    expect(msg.result).toEqual('SUCCESS');
  });

  it('should return a person on successful phone validate request', async () => {
    await personDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
      phone: '15135555555',
    });
    await authenticationDataSource.requestLogin({
      identity: {
        phone: '15135555555',
      },
    });

    const otp = await sequelize.models.otp.findOne({
      where: {
        identity: '15135555555',
      },
    });

    const { person } = await authenticationDataSource.validateLogin({
      identity: {
        phone: '15135555555',
      },
      otp: otp.code,
    });

    expect(person.firstName).toEqual('Vincent');
  });

  it("should refresh a person's session", async () => {
    const person = await personDataSource.model.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Vincent',
      lastName: 'Wilson',
      email: '123@123.123',
    });
    const token = await refreshTokenDataSource.createToken({
      personId: person.id,
    });

    const { accessToken } = await authenticationDataSource.refreshSession({
      refreshToken: token,
    });
    const tokenData = registerToken(accessToken);

    expect(tokenData.personId).toEqual(person.id);
  });

  it('should not differentiate between an identity with varying case', async () => {
    await personDataSource.model.create({
      originId: '2',
      originType: 'rock',
      firstName: 'Bill',
      lastName: 'Cheetler',
      email: 'bill@cheetler.com',
    });

    const msg = await authenticationDataSource.requestLogin({
      identity: {
        email: 'bIlL@ChEeTlEr.cOm',
      },
    });

    expect(msg.result).toEqual('SUCCESS');

    await personDataSource.model.create({
      originId: '3',
      originType: 'rock',
      firstName: 'Bob',
      lastName: 'Bobberson',
      email: 'BobBobberson@thebomb.com',
    });

    const msg2 = await authenticationDataSource.requestLogin({
      identity: {
        email: 'bobbobberson@thebomb.com',
      },
    });

    expect(msg2.result).toEqual('SUCCESS');
  });

  describe('requestLinkCode', () => {
    it('should return an error result if not given a "link_code" identity', async () => {
      const phoneOutput = await authenticationDataSource.requestLinkCode({
        input: { phone: '15135555555' },
      });
      const emailOutput = await authenticationDataSource.requestLinkCode({
        input: { email: 'a@b.com' },
      });

      expect(phoneOutput.result).toBe('ERROR');
      expect(emailOutput.result).toBe('ERROR');
    });

    it('should return a new, unclaimed link code', async () => {
      const output = await authenticationDataSource.requestLinkCode({
        input: { clientId: 'ryan-tv' },
      });

      expect(output).toMatchObject({
        result: 'SUCCESS',
        otp: expect.any(String),
        expiresAt: expect.any(Date),
        authenticatedPerson: null,
      });
    });

    it('should return a claimed link code', async () => {
      const ryan = await personDataSource.model.create({
        originId: '2112',
        originType: 'rock',
        firstName: 'Ryan',
        lastName: 'Davidson',
        email: 'a@b.com',
      });

      const unclaimedLinkCode = await authenticationDataSource.requestLinkCode({
        input: { clientId: 'ryan-tv' },
      });

      // Note: Using the OTP datasource method directly
      await otpDataSource.claimLinkCode({
        code: unclaimedLinkCode.otp,
        person: ryan,
      });

      const claimedLinkCode = await authenticationDataSource.requestLinkCode({
        input: { clientId: 'ryan-tv' },
      });

      expect(claimedLinkCode).toMatchObject({
        result: 'SUCCESS',
        otp: expect.any(String),
        expiresAt: expect.any(Date),
        authenticatedPerson: expect.objectContaining({
          person: expect.any(Object),
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      });
    });
  });
});
