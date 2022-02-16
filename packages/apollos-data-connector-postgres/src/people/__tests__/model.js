/* eslint-disable import/named */

import { getSequelize } from '../../postgres/index';
import * as People from '../index';
import {
  ContentItem,
  Media,
  ContentItemCategory,
  Campus,
  Follow,
} from '../../index';

import { setupPostgresTestEnv } from '../../utils/testUtils';

describe('People model', () => {
  let sequelize;
  let globalSequelize;
  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    await setupPostgresTestEnv(
      [People, ContentItem, ContentItemCategory, Campus, Media, Follow],
      { church: { slug: 'apollos_demo' } }
    );
  });
  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
    await globalSequelize.truncate({ cascade: true });
  });

  it('constructs without issues', async () => {
    await sequelize.models.people.create({
      firstName: 'Vincent',
      lastName: 'Wilson',
      gender: 'MALE',
      originType: 'rock',
      originId: '1',
    });

    const me = await sequelize.models.people.findOne();

    expect(me.firstName).toBe('Vincent');
    expect(me.createdAt).toBeInstanceOf(Date);
    expect(me.id).toMatch(
      /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}/i
    );
  });
});
