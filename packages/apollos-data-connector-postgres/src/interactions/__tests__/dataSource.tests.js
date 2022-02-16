import { dataSource as ConfigDataSource } from '@apollosproject/config';
import { getSequelize } from '../../postgres/index';
import * as People from '../../people';
import * as Campuses from '../../campus';
import * as ContentItem from '../../content-items';
import * as Media from '../../media';
import * as ContentItemCategory from '../../content-item-categories';
import * as Int from '../index';
import { setupPostgresTestEnv } from '../../utils/testUtils';

let currentPerson;

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
    },
  },
  church: { slug: 'apollos_demo' },
};

let context = defaultContext;

let Interaction;

describe('Interaction model', () => {
  let sequelize;
  let globalSequelize;
  beforeEach(async () => {
    sequelize = getSequelize({ churchSlug: 'apollos_demo' });
    globalSequelize = getSequelize({ churchSlug: 'global' });
    context = defaultContext;
    await setupPostgresTestEnv(
      [Int, People, Campuses, ContentItem, Media, ContentItemCategory],
      { church: { slug: 'apollos_demo' } }
    );

    // eslint-disable-next-line new-cap
    Interaction = new Int.dataSource();
    Interaction.initialize({ context });

    currentPerson = await sequelize.models.people.create({
      firstName: 'Jill',
      lastName: 'Francisco',
      originId: '1',
      originType: 'rock',
    });
  });
  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
    await globalSequelize.truncate({ cascade: true });
  });

  it('creates an interaction for a user and content item', async () => {
    const contentItem = await sequelize.models.contentItem.create({
      originId: '1',
      originType: 'rock',
    });

    const result = await Interaction.createNodeInteraction({
      nodeId: contentItem.apollosId,
      action: 'VIEWED',
    });

    expect(result).toEqual({
      success: true,
      nodeId: contentItem.apollosId,
    });

    const latestInteraction = await sequelize.models.interaction.findOne();

    expect(latestInteraction.action).toBe('VIEWED');
    expect(latestInteraction.nodeType).toBe('ContentItem');
    expect(latestInteraction.nodeId).toBe(contentItem.id);
    expect(latestInteraction.personId).toBe(currentPerson.id);
  });

  it('returns interactions filtered by action', async () => {
    const contentItem = await sequelize.models.contentItem.create({
      originId: '1',
      originType: 'rock',
    });

    await Interaction.createNodeInteraction({
      nodeId: contentItem.apollosId,
      action: 'VIEWED',
    });

    await Interaction.createNodeInteraction({
      nodeId: contentItem.apollosId,
      action: 'LOVED',
    });

    await Interaction.createNodeInteraction({
      nodeId: contentItem.apollosId,
      action: 'WATCHED',
    });

    const viewedAndWatched = await Interaction.getInteractionsForCurrentUser({
      actions: ['VIEWED', 'WATCHED'],
    });

    expect(viewedAndWatched.map(({ action }) => action)).toContain('VIEWED');
    expect(viewedAndWatched.map(({ action }) => action)).toContain('WATCHED');
    expect(viewedAndWatched.length).toBe(2);
  });

  it('returns interactions filtered by action and item', async () => {
    const contentItem = await sequelize.models.contentItem.create({
      originId: '1',
      originType: 'rock',
      active: true,
    });

    const contentItem2 = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      active: true,
    });

    await Interaction.createNodeInteraction({
      nodeId: contentItem.apollosId,
      action: 'VIEWED',
    });

    await Interaction.createNodeInteraction({
      nodeId: contentItem2.apollosId,
      action: 'LOVED',
    });

    await Interaction.createNodeInteraction({
      nodeId: contentItem2.apollosId,
      action: 'WATCHED',
    });

    const justWatched = await Interaction.getInteractionsForCurrentUserAndNodes(
      {
        actions: ['VIEWED', 'WATCHED'],
        nodeIds: [contentItem2.apollosId],
      }
    );

    expect(justWatched.map(({ action }) => action)).toContain('WATCHED');
    expect(justWatched.length).toBe(1);
  });

  it('calls additional interactions, such as updateSeriesStarted', async () => {
    // eslint-disable-next-line
    context.dataSources.ContentItem = new ContentItem.dataSource();
    context.dataSources.ContentItem.initialize({ context });

    const contentItem = await sequelize.models.contentItem.create({
      originId: '1',
      originType: 'rock',
      active: true,
    });

    const contentItem2 = await sequelize.models.contentItem.create({
      originId: '2',
      originType: 'rock',
      active: true,
    });

    await contentItem.setParent(contentItem2);

    await Interaction.createNodeInteraction({
      nodeId: contentItem.apollosId,
      action: 'COMPLETE',
      awaitAdditional: true,
    });

    const interactions = await Interaction.getInteractionsForCurrentUser();

    expect(interactions.map(({ action }) => action)).toContain('SERIES_START');
    expect(interactions.map(({ action }) => action)).toContain('COMPLETE');
    expect(interactions.length).toBe(2);
  });
});
