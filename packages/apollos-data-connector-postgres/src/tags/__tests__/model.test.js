import { sequelize } from '../../postgres/index';
import { createModel, setupModel } from '../model';
import * as ContentItem from '../../content-items/model';
import * as People from '../../people/model';
import * as Campus from '../../campus/model';
import * as Media from '../../media/model';
import migrations from '../migrations';
import ContentItemMigrations from '../../content-items/migrations';
import PeopleMigrations from '../../people/migrations';
import CampusMigrations from '../../campus/migrations';
import MediaMigrations from '../../media/migrations';
import createMigrationRunner from '../../postgres/performMigrations';

describe('Tag model', () => {
  beforeEach(async () => {
    await ContentItem.createModel();
    await People.createModel();
    await Campus.createModel();
    await Media.createModel();
    await createModel();

    const migrationRunner = await createMigrationRunner({
      migrations: [
        ...migrations,
        ...ContentItemMigrations,
        ...PeopleMigrations,
        ...CampusMigrations,
        ...MediaMigrations,
      ],
      logger: null,
    });
    await migrationRunner.up();
    await ContentItem.setupModel();
    await setupModel();
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
