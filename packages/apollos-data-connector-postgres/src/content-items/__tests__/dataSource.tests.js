import ApollosConfig from '@apollosproject/config';
import { sequelize } from '../../postgres/index';
import {
  Media,
  ContentItemCategory,
  ContentItemsConnection,
  ContentItem as ContentItemDataObject,
  Tag,
  Person,
  Campus,
} from '../../index';

import { setupPostgresTestEnv } from '../../utils/testUtils';

let contentItem1;
let ContentItem;

let currentPerson;
const context = {
  dataSources: {
    Person: {
      getCurrentPersonId: () => currentPerson.id,
    },
  },
};

ApollosConfig.loadJs({
  CONTENT: {},
});

describe('Apollos Postgres ContentItem DataSource', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([
      ContentItemDataObject,
      Media,
      ContentItemCategory,
      ContentItemsConnection,
      Tag,
      Person,
      Campus,
    ]);

    contentItem1 = await sequelize.models.contentItem.create({
      originId: '1',
      originType: 'rock',
      apollosType: 'UniversalContentItem',
      title: 'The First Content Item',
      active: true,
    });

    ContentItem = new ContentItemDataObject.dataSource();
    ContentItem.initialize({ context });
  });
  afterEach(async () => {
    await sequelize.drop({});
    currentPerson = null;
  });

  it('fetches a ContentItem by id', async () => {
    const item = await ContentItem.getFromId(contentItem1.id);

    expect(item.id).toBe(contentItem1.id);

    const itemFromRock = await ContentItem.getFromId('1', null, {
      originType: 'rock',
    });

    expect(itemFromRock.id).toBe(contentItem1.id);
  });

  it('returns a share url', async () => {
    const shareUrl = await ContentItem.getShareUrl(contentItem1);

    expect(shareUrl).toEqual(
      `undefined/app-link/content/UniversalContentItem:${contentItem1.id}`
    );
  });

  it('fetches sermons', async () => {
    const sermonCategory = await sequelize.models.contentItemCategory.create({
      originType: 'rock',
      originId: '1',
      title: 'Sermons',
    });

    ApollosConfig.loadJs({
      CONTENT: {
        SERMON_CHANNEL_IDS: [sermonCategory.id],
      },
    });

    const sermon = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'MediaContentItem',
      title: 'Sermon Item',
      active: true,
      contentItemCategoryId: sermonCategory.id,
    });

    const sermons = await ContentItem.getSermons();

    expect(sermons.map(({ id }) => id)).toContain(sermon.id);
    expect(sermons.map(({ id }) => id)).not.toContain(contentItem1);
  });
  it('gets cover images', async () => {
    const coverImage = await sequelize.models.media.create({
      type: 'IMAGE',
      originType: 'rock',
      originId: '1',
    });

    await contentItem1.setCoverImage(coverImage);

    expect(await ContentItem.getCoverImage(contentItem1)).toEqual(
      await coverImage.reload()
    );
  });
  it('gets cover images', async () => {
    const coverImage = await sequelize.models.media.create({
      type: 'IMAGE',
      originType: 'rock',
      originId: '1',
    });

    await contentItem1.setCoverImage(coverImage);

    expect(await ContentItem.getCoverImage(contentItem1)).toEqual(
      await coverImage.reload()
    );
  });
  it('gets siblings items', async () => {
    const parent = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      title: 'Sermon Item',
      active: true,
    });

    const sibiling = await sequelize.models.contentItem.create({
      originId: '3',
      originType: 'rock',
      apollosType: 'UniversalContentItem',
      title: 'Sibling Item',
      active: true,
    });

    await contentItem1.setParent(parent);
    await sibiling.setParent(parent);

    const siblings = await ContentItem.getSiblings(contentItem1);

    expect(siblings.map(({ id }) => id)).toEqual([
      contentItem1.id,
      sibiling.id,
    ]);
  });
  it('gets from persona feed', async () => {
    const personaItem = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      title: 'Sermon Item',
      active: true,
    });

    currentPerson = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
      firstName: 'Vincent',
      gender: 'MALE',
    });

    const validTag = await sequelize.models.tag.create({
      type: 'Persona',
      data: { guid: '123' },
      originId: '1',
      originType: 'rock',
      name: 'Men',
    });

    const invalidTag = await sequelize.models.tag.create({
      type: 'Persona',
      data: { guid: '456' },
      originId: '2',
      originType: 'rock',
      name: 'Women',
    });

    await personaItem.addTag(validTag);
    await contentItem1.addTag(invalidTag);

    await currentPerson.addTag(validTag);

    const personaItems = await ContentItem.getPersonaFeed();
    expect(personaItems.map(({ id }) => id)).toEqual([personaItem.id]);
  });
});
