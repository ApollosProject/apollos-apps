import { sequelize } from '../../postgres/index';
import * as ContentItem from '../../content-items';
import * as Media from '../../media';
import * as Tag from '../index';
import * as People from '../../people';
import * as Campus from '../../campus';
import * as ContentItemCategory from '../../content-item-categories';

import { setupPostgresTestEnv } from '../../utils/testUtils';

describe('Tag model', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([
      ContentItem,
      ContentItemCategory,
      Media,
      People,
      Campus,
      Tag,
    ]);
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
  });

  it('adds tag to content item', async () => {
    const content = await sequelize.models.contentItem.create({
      title: 'Parent Item',
      originType: 'rock',
      originId: '1',
    });

    const tag = await sequelize.models.tag.create({
      name: 'Test Tag',
      type: 'ContentTag',
      data: {
        message: 'This is a test tag :)',
      },
      originId: '2',
      originType: 'rock',
    });

    await content.addTag(tag);
    const contentTags = await content.getTags();

    expect(contentTags[0].get('id')).toEqual(tag.get('id'));
  });

  it('adds tag to people', async () => {
    const person = await sequelize.models.people.create({
      firstName: 'John',
      lastName: 'doe',
      gender: 'MALE',
      originType: 'rock',
      originId: '1',
    });

    const tag = await sequelize.models.tag.create({
      name: 'Test Tag',
      type: 'ContentTag',
      data: {
        message: 'This is a test tag :)',
      },
      originId: '4',
      originType: 'rock',
    });

    await person.addTag(tag);
    const personTags = await person.getTags();

    expect(personTags[0].get('id')).toEqual(tag.get('id'));
  });
});
