/* eslint-disable import/named, new-cap */
import ApollosConfig from '@apollosproject/config';
import { times, uniq } from 'lodash';
import { sequelize } from '../../postgres/index';
import {
  Media,
  ContentItemCategory,
  ContentItemsConnection,
  ContentItem as ContentItemDataObject,
  Tag,
  Person,
  Campus,
  Feature,
  Interactions,
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
  models: {
    Node: {
      getPossibleDataModels: () => [
        'UniversalContentItem',
        'ContentItem',
        'ContentSeriesContentItem',
      ],
      get: jest.fn(() => ({})),
    },
  },
};

ApollosConfig.loadJs({
  CONTENT: {
    TYPES: ['UniversalContentItem', 'ContentSeriesContentItem'],
  },
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
      Feature,
      Interactions,
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
    await sequelize.drop({ cascade: true });
    currentPerson = null;
  });

  it('fetches features in order of priority', async () => {
    const contentItemId = contentItem1.get('id');
    const featureTypes = ['Scripture', 'AddComment', 'CommentList'];
    const features = await Promise.all(
      new Array(5).fill('').map((_, index) =>
        sequelize.models.feature.create({
          parentType: 'ContentItem',
          parentId: contentItemId,
          type: featureTypes[Math.floor(Math.random() * featureTypes.length)],
          data: { featureIndex: index },
          priority: index,
        })
      )
    );
    const contentItemFeatures = await ContentItem.getFeatures(contentItem1);
    const featureIndexes = features.map((_, i) => i);
    const contentItemFeaturePriorities = await Promise.all(
      contentItemFeatures.map(async (feature) => feature.get('priority'))
    );

    expect(featureIndexes).toEqual(contentItemFeaturePriorities);
  });
  it('fetches a ContentItem by id', async () => {
    const item = await ContentItem.getFromId(contentItem1.id);

    expect(item.id).toBe(contentItem1.id);

    const itemFromRock = await ContentItem.getFromId('1', null, {
      originType: 'rock',
    });

    expect(itemFromRock.id).toBe(contentItem1.id);
  });
  it('will fetch newly published items', async () => {
    const contentItemPublished = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'UniversalContentItem',
      title: 'The First Content Item',
      active: true,
      publishAt: new Date(new Date().getTime() - 10000),
    });
    const item = await ContentItem.getFromId(contentItemPublished.id);

    expect(item.id).toBe(contentItemPublished.id);

    const contentItemNotPublished = await sequelize.models.contentItem.create({
      originId: '3',
      originType: 'rock',
      apollosType: 'UniversalContentItem',
      title: 'The First Content Item',
      active: true,
      publishAt: new Date(new Date().getTime() + 10000),
    });

    const notFoundItem = await ContentItem.getFromId(
      contentItemNotPublished.id
    );

    expect(notFoundItem).toBe(null);
  });
  it('will not fetch expired items', async () => {
    const contentItemExpired = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'UniversalContentItem',
      title: 'The First Content Item',
      active: true,
      publishAt: new Date(new Date().getTime() - 10000),
      expireAt: new Date(new Date().getTime() - 100),
    });
    const item = await ContentItem.getFromId(contentItemExpired.id);

    expect(item).toBe(null);
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
  it('gets items by rock content channel id', async () => {
    const category = await sequelize.models.contentItemCategory.create({
      originType: 'rock',
      originId: '1',
      title: 'Sermons',
    });

    const categoryItem = await sequelize.models.contentItem.create({
      originId: '3',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      active: true,
      contentItemCategoryId: category.id,
    });

    const items = await ContentItem.getFromCategoryIds([1]);

    expect(items.map(({ id }) => id)).toEqual([categoryItem.id]);
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

    await contentItem1.setParent(parent); // parentId
    await sibiling.setParent(parent); // parentId

    await parent.addChild(contentItem1, {
      through: {
        order: 0,
        originId: '12',
        originType: 'rock',
        apollosType: 'ContentChannel',
      },
    });

    await parent.addChild(sibiling, {
      through: {
        order: 1,
        originId: '13',
        originType: 'rock',
        apollosType: 'ContentChannel',
      },
    });

    const siblings = await ContentItem.getSiblings(contentItem1);

    expect(siblings.map(({ id }) => id)).toEqual([
      contentItem1.id,
      sibiling.id,
    ]);
  });
  it('gets children items, sorted by order', async () => {
    const parent = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      title: 'Sermon Item',
      active: true,
    });

    const createdChildren = await Promise.all(
      [1, 0, 2, 3].map(async (order, i) => {
        const child = await sequelize.models.contentItem.create({
          originId: `${i}${order}`,
          originType: 'rock',
          apollosType: 'UniversalContentItem',
          title: 'Sibling Item',
          active: true,
          publishAt: new Date(),
        });
        await parent.addChild(child, {
          through: {
            order,
            originId: order,
            originType: 'rock',
            apollosType: 'ContentChannel',
          },
        });
        return child;
      })
    );

    const children = await ContentItem.getChildren(parent);

    expect(children.map(({ id }) => id)).toEqual([
      createdChildren[1].id, // Sorting by order, check the order array above
      createdChildren[0].id,
      createdChildren[2].id,
      createdChildren[3].id,
    ]);
  });
  it('gets children items, sorted by publishAt', async () => {
    const parent = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      title: 'Sermon Item',
      active: true,
    });

    const createdChildren = await Promise.all(
      [0, 1, 2, 3].map(async (order, i) => {
        const child = await sequelize.models.contentItem.create({
          originId: `${i}${order}`,
          originType: 'rock',
          apollosType: 'UniversalContentItem',
          title: 'Sibling Item',
          active: true,
          publishAt: new Date(new Date().valueOf() - i * 10000), // items are getting older
        });
        await parent.addChild(child, {
          through: {
            order: 0, // same order every time
            originId: order,
            originType: 'rock',
            apollosType: 'ContentChannel',
          },
        });
        return child;
      })
    );

    const children = await ContentItem.getChildren(parent);

    expect(children.map(({ id }) => id)).toEqual([
      createdChildren[3].id, // Sorting by order, check the order array above
      createdChildren[2].id,
      createdChildren[1].id,
      createdChildren[0].id,
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
  it('gets active items by default', async () => {
    await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      active: false,
    });

    const activeItem = await sequelize.models.contentItem.create({
      originId: '3',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      active: true,
    });

    const items = await ContentItem.getUserFeed();

    expect(items.map(({ id }) => id)).toEqual([contentItem1.id, activeItem.id]);
  });
  it('paginates', async () => {
    await Promise.all(
      times(30, async (i) => {
        return sequelize.models.contentItem.create({
          originId: `${i + 2}`,
          originType: 'rock',
          apollosType: 'UniversalContentItem',
          active: true,
        });
      })
    );

    const initialItems = await ContentItem.paginate({
      orderBy: [['createdAt', 'ASC']],
    });

    const lastItems = await ContentItem.paginate({
      after: initialItems.edges[19].cursor,
      orderBy: [['createdAt', 'ASC']],
    });

    expect(initialItems.edges[0].node.id).toEqual(contentItem1.id);
    expect(initialItems.edges.length).toEqual(20);
    // 10 remaining items + the initial seed item.
    expect(lastItems.edges.length).toEqual(11);

    expect(initialItems.getTotalCount()).toEqual(31);
  });
  it('paginates a custom cursor', async () => {
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

    const invalidItems = [];
    await Promise.all(
      times(30, async (i) => {
        const invalidItem = await sequelize.models.contentItem.create({
          originId: `${i + 2}`,
          originType: 'rock',
          apollosType: 'UniversalContentItem',
          active: true,
        });
        await invalidItem.addTag(invalidTag);
        invalidItems.push(invalidItem);
      })
    );

    const validItems = [];
    await Promise.all(
      times(30, async (i) => {
        const validItem = await sequelize.models.contentItem.create({
          originId: `${i + 32}`,
          originType: 'rock',
          apollosType: 'UniversalContentItem',
          active: true,
        });
        await validItem.addTag(validTag);
        validItems.push(validItem);
      })
    );

    await currentPerson.addTag(validTag);

    const initialItems = await ContentItem.paginate({
      cursor: ContentItem.getPersonaFeed,
    });

    const lastItems = await ContentItem.paginate({
      after: initialItems.edges[19].cursor,
      cursor: ContentItem.getPersonaFeed,
    });

    const allItemIds = [...initialItems.edges, ...lastItems.edges].map(
      ({ node }) => node.id
    );

    // uniqe, to make sure we aren't cheating,.
    expect(uniq(allItemIds).length).toEqual(30);
    expect(initialItems.edges.length).toEqual(20);
    expect(lastItems.edges.length).toEqual(10);
    expect(
      invalidItems.every(({ id }) => !allItemIds.includes(id))
    ).toBeTruthy();
    expect(validItems.every(({ id }) => allItemIds.includes(id))).toBeTruthy();
  });

  it('fetches series in progress by category IDs', async () => {
    const InteractionDataSource = new Interactions.dataSource();
    InteractionDataSource.initialize({ context });

    currentPerson = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'MALE',
    });

    const contentItemCategory = await sequelize.models.contentItemCategory.create(
      {
        title: 'Test Category',
        originId: '6',
        originType: 'rock',
      }
    );

    const seriesContentItem = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      title: 'Content Series Parent Item',
      publishAt: new Date(),
      active: true,
      contentItemCategoryId: contentItemCategory.id,
    });

    contentItem1.parentId = seriesContentItem.id;
    contentItem1.publishAt = new Date();
    await contentItem1.save();

    await sequelize.models.contentItem.create({
      originId: '3',
      originType: 'rock',
      apollosType: 'UniversalContentItem',
      title: 'The Second Content Item',
      active: true,
      parentId: seriesContentItem.id,
      publishAt: new Date(),
    });

    await InteractionDataSource.createNodeInteraction({
      nodeId: contentItem1.apollosId,
      action: 'COMPLETE',
      additional: false,
    });

    const seriesWithUserProgress = await ContentItem.getSeriesWithUserProgress({
      categoryIds: [contentItemCategory.id],
    });

    expect(seriesWithUserProgress.length).toBe(1);
    expect(seriesWithUserProgress[0].id).toEqual(seriesContentItem.id);
  });

  it('fetches the completion percentage of a Series Content Item', async () => {
    const InteractionDataSource = new Interactions.dataSource();
    InteractionDataSource.initialize({ context });

    currentPerson = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'MALE',
    });

    const seriesContentItem = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      title: 'Content Series Parent Item',
      publishAt: new Date(),
      active: true,
    });

    contentItem1.parentId = seriesContentItem.id;
    contentItem1.publishAt = new Date();
    await contentItem1.save();

    const contentItem2 = await sequelize.models.contentItem.create({
      originId: '3',
      originType: 'rock',
      apollosType: 'UniversalContentItem',
      title: 'The Second Content Item',
      active: true,
      parentId: seriesContentItem.id,
      publishAt: new Date(),
    });

    // Create content item connections
    await Promise.all(
      [contentItem1, contentItem2].map(async ({ id: childId }, index) =>
        sequelize.models.contentItemsConnection.create({
          parentId: seriesContentItem.id,
          childId,
          originId: `${4 + index}`,
          originType: 'rock',
        })
      )
    );

    await InteractionDataSource.createNodeInteraction({
      nodeId: contentItem1.apollosId,
      action: 'COMPLETE',
      additional: false,
    });

    const percentComplete = await ContentItem.getPercentComplete(
      seriesContentItem
    );

    expect(percentComplete).toEqual(50);
  });

  it('gets the next incomplete item in a series', async () => {
    const InteractionDataSource = new Interactions.dataSource();
    InteractionDataSource.initialize({ context });

    currentPerson = await sequelize.models.people.create({
      originId: '1',
      originType: 'rock',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'MALE',
    });

    const seriesContentItem = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      apollosType: 'ContentSeriesContentItem',
      title: 'Content Series Parent Item',
      publishAt: new Date(),
      active: true,
    });

    const childItemCount = 5;

    const childItems = await Promise.all(
      new Array(childItemCount).fill('').map(async (_, index) => {
        const contentItem = await sequelize.models.contentItem.create({
          originId: `${3 + index}`,
          originType: 'rock',
          apollosType: 'UniversalContentItem',
          title: `Content Item ${index + 1}`,
          active: true,
          parentId: seriesContentItem.id,
          publishAt: new Date(),
        });

        await sequelize.models.contentItemsConnection.create({
          parentId: seriesContentItem.id,
          childId: contentItem.id,
          originId: `${3 + childItemCount + index}`,
          originType: 'rock',
          order: index,
        });

        return contentItem;
      })
    );

    // Next up should be the first item
    let nextUp = await ContentItem.getUpNext(seriesContentItem);
    expect(nextUp.id).toEqual(childItems[0].id);

    // View the first child item
    await InteractionDataSource.createNodeInteraction({
      nodeId: childItems[0].apollosId,
      action: 'COMPLETE',
      additional: false,
    });

    nextUp = await ContentItem.getUpNext(seriesContentItem);

    // Next Up should be the second item
    expect(nextUp.id).toEqual(childItems[1].id);

    // View the last child item
    await InteractionDataSource.createNodeInteraction({
      nodeId: childItems[childItems.length - 1].apollosId,
      action: 'COMPLETE',
      additional: false,
    });

    nextUp = await ContentItem.getUpNext(seriesContentItem);

    // Next Up should be null
    expect(nextUp).toBeNull();
  });
});
