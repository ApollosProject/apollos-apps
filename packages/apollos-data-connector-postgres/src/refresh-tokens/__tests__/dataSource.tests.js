/* eslint-disable import/named, new-cap */
import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { getSequelize } from '../../postgres/index';
import {
  Campus,
  ContentItem,
  ContentItemCategory,
  Media,
  Person,
  RefreshToken,
} from '../../index';

import { setupPostgresTestEnv } from '../../utils/testUtils';

const Config = new ConfigDataSource();
Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

const context = {
  dataSources: {
    Campus,
    Config,
    ContentItem,
    ContentItemCategory,
    Media,
    Person,
    RefreshToken,
  },
  church: { slug: 'apollos_demo' },
};

const RefreshTokenDataSource = RefreshToken.dataSource;

describe('Apollos Postgres RefreshToken DataSource', () => {
  let refreshTokenDataSource;
  let sequelize;
  let globalSequelize;
  let person1;

  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });

    await setupPostgresTestEnv(
      [Campus, ContentItem, ContentItemCategory, Media, Person, RefreshToken],
      {
        church: { slug: 'apollos_demo' },
      }
    );

    person1 = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
    });

    refreshTokenDataSource = new RefreshTokenDataSource();
    refreshTokenDataSource.initialize({ context });
  });
  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
    await globalSequelize.truncate({ cascade: true });
  });

  it('adds a Refresh Token and confirms its existence', async () => {
    // Create token
    await refreshTokenDataSource.createToken({
      personId: person1.id,
    });

    // Validate token
    const createdToken = await sequelize.models.refreshToken.findOne({
      where: { personId: person1.id },
    });

    expect(createdToken).toBeDefined();
    expect(createdToken.personId).toEqual(person1.id);
  });
  it('gets a token record given a jwt token', async () => {
    // Create token
    const jwtToken = await refreshTokenDataSource.createToken({
      personId: person1.id,
    });

    // Get token
    const token = await refreshTokenDataSource.getValidToken({
      jwtToken,
    });

    expect(token).toBeDefined();
    expect(token.personId).toEqual(person1.id);
  });
});
