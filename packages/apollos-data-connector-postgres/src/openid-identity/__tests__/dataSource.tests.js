/* eslint-disable import/named, new-cap */
import { dataSource as ConfigDataSource } from '@apollosproject/config';
import fetch, { setResponse } from 'node-fetch';
import { Issuer, callback, userinfo, refresh } from 'openid-client';
import { getSequelize } from '../../postgres/index';
import * as OpenIdIdentity from '..';
import {
  Media,
  Person,
  Campus,
  ContentItem,
  ContentItemCategory,
  RefreshToken,
} from '../../index';

import { setupPostgresTestEnv } from '../../utils/testUtils';

jest.mock('node-fetch');
jest.mock('openid-client');

let currentPerson;

const Config = new ConfigDataSource();
Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

Config.loadJs({
  ROCK: {
    URL: 'https://rock.apollos.app',
    OPEN_ID_SECRET: '123-123-123',
  },
});

const context = {
  dataSources: {
    Person: {
      getCurrentPerson: () => currentPerson,
    },
    Authentication: {
      createAuthenticatedPerson: jest.fn(() => ({
        person: currentPerson,
        accessToken: 'myAccessToken',
        refreshToken: 'myRefreshToken',
      })),
    },
    Config,
  },
  church: { slug: 'apollos_demo' },
};

const OpenIdIdentityDataSource = OpenIdIdentity.dataSource;

describe('openid datasource', () => {
  let sequelize;
  let globalSequelize;

  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    await setupPostgresTestEnv(
      [
        Media,
        ContentItem,
        ContentItemCategory,
        Person,
        Campus,
        OpenIdIdentity,
        RefreshToken,
      ],
      { church: { slug: 'apollos_demo' } }
    );
    currentPerson = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Vincent',
      gender: 'MALE',
    });
  });

  afterEach(async () => {
    await sequelize.drop({ cascade: true });
    await globalSequelize.drop({ cascade: true });
    jest.clearAllMocks();
  });

  it('registers a rock openid code', async () => {
    setResponse([
      { ClientId: 'client-id-123', RedirectUri: 'http://apollos.app/redirect' },
    ]);
    const openIdDataSource = new OpenIdIdentityDataSource();
    openIdDataSource.initialize({ context });
    const { success } = await openIdDataSource.registerCode({
      type: 'rock',
      code: '123',
    });
    const dbIdentity = (
      await currentPerson.getOpenIdIdentities({
        where: { providerType: 'rock' },
      })
    )?.[0];
    expect(success).toBe(true);
    expect(fetch.mock.calls).toMatchSnapshot();
    expect(Issuer.discover.mock.calls).toMatchSnapshot();
    expect(callback.mock.calls).toMatchSnapshot();
    expect(dbIdentity.idToken).toMatchSnapshot();
  });

  it('registers a new user in our postgres database', async () => {
    setResponse([
      { ClientId: 'client-id-123', RedirectUri: 'http://apollos.app/redirect' },
    ]);

    const openIdDataSource = new OpenIdIdentityDataSource();
    context.dataSources.RefreshToken = new RefreshToken.dataSource();
    openIdDataSource.initialize({ context });
    context.dataSources.RefreshToken.initialize({ context });

    const {
      accessToken,
      refreshToken,
    } = await openIdDataSource.registerWithCode({
      type: 'rock',
      code: '123',
    });
    const newPerson = await sequelize.models.people.findOne({
      where: { originId: '81' },
    });
    expect(newPerson.firstName).toBe('Conrad');
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('updates an existing person in our postgres database', async () => {
    setResponse([
      { ClientId: 'client-id-123', RedirectUri: 'http://apollos.app/redirect' },
    ]);

    const openIdDataSource = new OpenIdIdentityDataSource();
    context.dataSources.RefreshToken = new RefreshToken.dataSource();
    openIdDataSource.initialize({ context });
    context.dataSources.RefreshToken.initialize({ context });

    const existingPerson = await sequelize.models.people.create({
      originId: '81',
      originType: 'rock',
      firstName: 'Jeff',
    });

    context.dataSources.Authentication.createAuthenticatedPerson.mockImplementationOnce(
      () => ({
        person: existingPerson,
        accessToken: '123',
        refreshToken: '123',
      })
    );

    const { person } = await openIdDataSource.registerWithCode({
      type: 'rock',
      code: '123',
    });
    const newPerson = await sequelize.models.people.findOne({
      where: { originId: '81' },
    });

    expect(newPerson.firstName).toBe('Conrad');
    expect(person.id).toBe(existingPerson.id);
  });

  it("return's a user's identity using their openid credentials", async () => {
    setResponse([
      { ClientId: 'client-id-123', RedirectUri: 'http://apollos.app/redirect' },
    ]);
    const openIdDataSource = new OpenIdIdentityDataSource();
    openIdDataSource.initialize({ context });

    await currentPerson.createOpenIdIdentity({
      accessToken: 'access-token-456',
      refreshToken: 'refresh-token-456',
      idToken: 'id-token-456',
      providerType: 'rock',
    });

    const identity = await openIdDataSource.getCurrentPersonIdentity({
      type: 'rock',
    });

    expect(identity).toMatchSnapshot();
    expect(userinfo.mock.calls).toMatchSnapshot();
  });

  it('refreshes a token if it expires when fetching a user identity', async () => {
    setResponse([
      { ClientId: 'client-id-123', RedirectUri: 'http://apollos.app/redirect' },
    ]);
    const openIdDataSource = new OpenIdIdentityDataSource();
    openIdDataSource.initialize({ context });

    await currentPerson.createOpenIdIdentity({
      accessToken: 'access-token-456',
      refreshToken: 'refresh-token-456',
      idToken: 'id-token-456',
      providerType: 'rock',
    });

    userinfo.mockImplementationOnce(() => {
      throw new Error('Token expired');
    });

    const identity = await openIdDataSource.getCurrentPersonIdentity({
      type: 'rock',
    });

    const dbIdentity = (
      await currentPerson.getOpenIdIdentities({
        where: { providerType: 'rock' },
      })
    )?.[0];

    expect(identity).toMatchSnapshot();
    expect(dbIdentity.idToken).toBe('id-token-8910');
    expect(refresh.mock.calls).toMatchSnapshot();
  });
});
