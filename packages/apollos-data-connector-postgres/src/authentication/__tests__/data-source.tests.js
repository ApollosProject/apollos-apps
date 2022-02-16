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
    await globalSequelize.truncate({ cascade: true });
    await sequelize.truncate({ cascade: true });
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
});
