/* eslint-disable import/named */

import { sequelize } from '../../postgres/index';
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
  beforeEach(async () => {
    await setupPostgresTestEnv([
      People,
      ContentItem,
      ContentItemCategory,
      Campus,
      Media,
      Follow,
    ]);
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
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
