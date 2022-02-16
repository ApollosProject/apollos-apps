import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { getSequelize } from '../../postgres/index';
import * as People from '../../people';
import * as Campuses from '../../campus';
import * as ContentItem from '../../content-items';
import * as Media from '../../media';
import * as ContentItemCategory from '../../content-item-categories';
import * as Interactions from '../../interactions';
import { setupPostgresTestEnv } from '../../utils/testUtils';
import * as Like from '../index';

let currentPerson;
let contentItem;

const Config = new ConfigDataSource();
Config.initialize({ context: { church: { slug: 'apollos_demo' } } });

const defaultContext = {
  dataSources: {
    Person: {
      getCurrentPersonId: () => currentPerson.id,
      getFromId: (id) => ({ id }),
    },
    Config,
  },
  models: {
    Node: {
      getPossibleDataModels: () => ['UniversalContentItem', 'ContentItem'],
      get: jest.fn(() => ({})),
    },
  },
  church: { slug: 'apollos_demo' },
};

let context = defaultContext;

let Interaction;
let Likes;

describe('Likes dataSource', () => {
  let sequelize;
  let globalSequelize;
  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    context = defaultContext;
    await setupPostgresTestEnv(
      [Interactions, People, Campuses, ContentItem, Media, ContentItemCategory],
      { church: { slug: 'apollos_demo' } }
    );

    // eslint-disable-next-line new-cap
    Interaction = new Interactions.dataSource();
    // eslint-disable-next-line new-cap
    Likes = new Like.dataSource();
    Interaction.initialize({ context });
    Likes.initialize({ context });
    context.dataSources.Interactions = Interaction;

    currentPerson = await sequelize.models.people.create({
      firstName: 'Jill',
      lastName: 'Francisco',
      originId: '1',
      originType: 'rock',
    });

    contentItem = await sequelize.models.contentItem.create({
      originId: '1',
      originType: 'rock',
      active: true,
    });
  });
  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
    await globalSequelize.truncate({ cascade: true });
  });

  it('allows a user to like an item', async () => {
    await Likes.updateLikeNode({
      nodeId: contentItem.apollosId,
      operation: 'Like',
      resolveInfo: {},
    });
    const isLiked = await Likes.getIsLikedForCurrentUserAndNode({
      nodeId: contentItem.apollosId,
    });
    expect(context.models.Node.get.mock.calls[0][0]).toEqual(
      contentItem.apollosId
    );
    expect(isLiked).toBe(true);
  });

  it('allows a user to unlike an item', async () => {
    await Likes.updateLikeNode({
      nodeId: contentItem.apollosId,
      operation: 'Like',
      resolveInfo: {},
    });
    const isLiked = await Likes.getIsLikedForCurrentUserAndNode({
      nodeId: contentItem.apollosId,
    });
    expect(isLiked).toBe(true);

    await Likes.updateLikeNode({
      nodeId: contentItem.apollosId,
      operation: 'Unlike',
      resolveInfo: {},
    });
    const isLiked2 = await Likes.getIsLikedForCurrentUserAndNode({
      nodeId: contentItem.apollosId,
    });
    expect(isLiked2).toBe(false);
  });

  it("resists a user's effort to spam like", async () => {
    for (let i = 0; i <= 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await Likes.updateLikeNode({
        nodeId: contentItem.apollosId,
        operation: 'Like',
        resolveInfo: {},
      });
    }
    const isLiked = await Likes.getIsLikedForCurrentUserAndNode({
      nodeId: contentItem.apollosId,
    });
    expect(isLiked).toBe(true);

    await Likes.updateLikeNode({
      nodeId: contentItem.apollosId,
      operation: 'Unlike',
      resolveInfo: {},
    });
    const isLiked2 = await Likes.getIsLikedForCurrentUserAndNode({
      nodeId: contentItem.apollosId,
    });
    expect(isLiked2).toBe(false);
  });

  it('returns a like count', async () => {
    for (let i = 0; i <= 10; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await Likes.updateLikeNode({
        nodeId: contentItem.apollosId,
        operation: 'Like',
        resolveInfo: {},
      });
    }
    const likeCount = await Likes.getLikesCountByNodeId({
      nodeId: contentItem.apollosId,
    });
    expect(likeCount).toBe(1);
  });
  it("returns a user's liked items", async () => {
    const items1 = await Likes.getForCurrentUser({});
    expect(items1).toEqual([]);
    await Likes.updateLikeNode({
      nodeId: contentItem.apollosId,
      operation: 'Like',
      resolveInfo: {},
    });
    const items2 = await Likes.getForCurrentUser({});
    expect(items2.map(({ id }) => id)).toEqual(
      [contentItem].map(({ id }) => id)
    );
  });
});
