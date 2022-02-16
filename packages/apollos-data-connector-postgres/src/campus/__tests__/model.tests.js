/* eslint-disable import/named */
import { getSequelize } from '../../postgres/index';
import {
  Person,
  ContentItem,
  Media,
  Follow,
  ContentItemCategory,
} from '../../index';
import * as Campus from '../index';
import { setupPostgresTestEnv } from '../../utils/testUtils';

describe('Campus model', () => {
  let sequelize;
  let globalSequelize;
  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    await setupPostgresTestEnv(
      [Campus, Person, ContentItem, Media, Follow, ContentItemCategory],
      { church: { slug: 'apollos_demo' } }
    );
  });
  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
    await globalSequelize.truncate({ cascade: true });
  });

  it('constructs without issues', async () => {
    const campus = await sequelize.models.campus.create({
      name: 'main campus',
      originType: 'rock',
      originId: '1',
    });

    let me = await sequelize.models.people.create({
      firstName: 'Vincent',
      lastName: 'Wilson',
      gender: 'MALE',
      originType: 'rock',
      originId: '1',
    });

    await me.setCampus(campus);

    me = await me.reload();

    expect(me.campusId).toBe(campus.id);
  });
});
