/* eslint-disable import/named, new-cap */
import { dataSource as ConfigDataSource } from '@apollosproject/config';
// import fetch, { setResponse } from 'node-fetch';
// import { Issuer, callback, userinfo, refresh } from 'openid-client';
import { setResponse } from 'node-fetch';
import { userinfo, refresh } from 'openid-client';
import { getSequelize } from '../../postgres/index';
import * as OpenIdIdentity from '..';
import {
  Media,
  Person,
  Campus,
  ContentItem,
  ContentItemCategory,
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
      [Media, ContentItem, ContentItemCategory, Person, Campus, OpenIdIdentity],
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

  // TODO fix
  // it('registers a rock openid code', async () => {
  // setResponse([
  // { ClientId: 'client-id-123', RedirectUri: 'http://apollos.app/redirect' },
  // ]);
  // const openIdDataSource = new OpenIdIdentityDataSource();
  // openIdDataSource.initialize({ context });
  // const { success } = await openIdDataSource.registerCode({
  // type: 'rock',
  // code: '123',
  // });
  // const dbIdentity = (
  // await currentPerson.getOpenIdIdentities({
  // where: { providerType: 'rock' },
  // })
  // )?.[0];
  // expect(success).toBe(true);
  // expect(fetch.mock.calls).toMatchSnapshot();
  // expect(Issuer.discover.mock.calls).toMatchSnapshot();
  // expect(callback.mock.calls).toMatchSnapshot();
  // expect(dbIdentity.idToken).toBe('id-token-123');
  // });
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
