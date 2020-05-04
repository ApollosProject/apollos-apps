import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { AuthenticationError } from 'apollo-server';
import { dataSource as Interactions } from '../index';
import { buildGetMock } from '../../test-utils';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
    USE_PLUGIN: true,
  },
  APP: {
    DEEP_LINK_HOST: 'apolloschurch',
  },
});

const ds = new Interactions();

const context = {
  dataSources: {
    RockConstants: {
      modelType: buildGetMock({ Id: 123 }, ds),
      contentItemInteractionComponent: buildGetMock({ Id: 789 }, ds),
      interactionComponent: buildGetMock({ Id: 321 }, ds),
    },
    Auth: {
      getCurrentPerson: buildGetMock({ Id: 456, PrimaryAliasId: 456 }, ds),
    },
    ContentItem: {
      getCursorByChildContentItemId: () => ({ get: () => [{ id: '1' }] }),
      resolveType: () => ['UniversalContentItem'],
    },
  },
  models: {
    Node: {
      getPossibleDataModels: () => ['UniversalContentItem', 'ContentItem'],
    },
  },
};

describe('Interactions', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('creates a new content item interaction', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock({ Id: 1 }, ds);
    dataSource.post = buildGetMock('1', ds);

    const result = await dataSource.createContentItemInteraction({
      itemId: createGlobalId(1, 'UniversalContentItem'),
      operationName: 'Like',
      itemTitle: 'Super Cool Content',
    });
    delete dataSource.post.mock.calls[0][1].InteractionDateTime;
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.post.mock.calls).toMatchSnapshot();
  });

  it('creates a new interaction from a content item', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock({ Id: 1 }, ds);
    dataSource.post = buildGetMock('1', ds);

    const result = await dataSource.createNodeInteraction({
      nodeId: createGlobalId(1, 'UniversalContentItem'),
      action: 'VIEW',
    });
    delete dataSource.post.mock.calls[0][1].InteractionDateTime;
    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.post.mock.calls).toMatchSnapshot();
  });

  it('returns a success: false from an invalid nodeId', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock({ Id: 1 }, ds);
    dataSource.post = buildGetMock('1', ds);
    context.dataSources.RockConstants.modelType = () => Promise.resolve(null);

    const result = await dataSource.createNodeInteraction({
      nodeId: createGlobalId(1, 'InvalidNodeType'),
      action: 'VIEW',
    });

    expect(result).toMatchSnapshot();
    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.post.mock.calls).toMatchSnapshot();
    context.dataSources.RockConstants.modelType = buildGetMock({ Id: 123 }, ds);
  });
  it('creates additional interactions from a content item', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock({ Id: 1 }, ds);
    dataSource.post = buildGetMock('1', ds);
    dataSource.createAdditionalInteractions = jest.fn();

    await dataSource.createNodeInteraction({
      nodeId: createGlobalId(1, 'UniversalContentItem'),
      action: 'COMPLETE',
    });

    expect(
      dataSource.createAdditionalInteractions.mock.calls
    ).toMatchSnapshot();
  });
  it('use a lookup map to find additional interactions to fire', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.updateSeriesStarted = jest.fn();
    dataSource.ADDITIONAL_INTERACTIONS_MAP.ContentItem.COMPLETE = jest.fn();

    await dataSource.createAdditionalInteractions({
      id: 1,
      action: 'COMPLETE',
      __type: 'UniversalContentItem',
    });

    expect(
      dataSource.ADDITIONAL_INTERACTIONS_MAP.ContentItem.COMPLETE
    ).toMatchSnapshot();
  });
  it('creates a SERIES_START interaction when completing a series item', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock([], ds);
    dataSource.createNodeInteraction = jest.fn();

    await dataSource.updateSeriesStarted({
      id: 1,
    });

    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.createNodeInteraction.mock.calls).toMatchSnapshot();
  });
  it('does not create a SERIES_START interaction when completing a series item when you have completed other items ', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock([{ id: 2 }], ds);
    dataSource.createNodeInteraction = jest.fn();

    await dataSource.updateSeriesStarted({
      id: 1,
    });

    expect(dataSource.get.mock.calls).toMatchSnapshot();
    expect(dataSource.createNodeInteraction.mock.calls).toMatchSnapshot();
  });
  it('fetches interactions for a logged in user and nodeId', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock([{ Id: 1 }], ds);
    dataSource.post = buildGetMock('1', ds);

    const result = await dataSource.getNodeInteractionsForCurrentUser({
      nodeId: createGlobalId(2, 'UniversalContentItem'),
    });

    expect(result).toEqual([{ id: 1 }]);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });
  it('fetches interactions for a logged in user, nodeId, and actions', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock([{ Id: 1 }], ds);

    const result = await dataSource.getNodeInteractionsForCurrentUser({
      nodeId: createGlobalId(1, 'UniversalContentItem'),
      actions: ['READ', 'COMPLETE'],
    });

    expect(result).toEqual([{ id: 1 }]);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });
  it('fetches interactions for a logged in user, nodeId, and actions', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock([{ Id: 1 }], ds);

    const result = await dataSource.getNodeInteractionsForCurrentUser({
      nodeId: createGlobalId(1, 'UniversalContentItem'),
      actions: ['READ', 'COMPLETE'],
    });

    expect(result).toEqual([{ id: 1 }]);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });
  it('fetches interactions for multiple nodeIds', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock([{ Id: 1 }], ds);

    const result = await dataSource.getInteractionsForCurrentUserAndNodes({
      nodeIds: [
        createGlobalId(1, 'UniversalContentItem'),
        createGlobalId(2, 'UniversalContentItem'),
        createGlobalId(3, 'UniversalContentItem'),
      ],
      actions: ['READ', 'COMPLETE'],
    });

    expect(result).toEqual([{ id: 1 }]);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });
  it('it calls different endpoints if USE_PLUGIN is false', async () => {
    const dataSource = new Interactions();
    ApollosConfig.loadJs({
      ROCK: {
        API_URL: 'https://apollosrock.newspring.cc/api',
        API_TOKEN: 'some-rock-token',
        IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
        USE_PLUGIN: false,
      },
    });
    dataSource.initialize({ context });
    dataSource.get = buildGetMock([{ Id: 1 }], ds);

    const result = await dataSource.getNodeInteractionsForCurrentUser({
      nodeId: createGlobalId(1, 'UniversalContentItem'),
      actions: ['READ', 'COMPLETE'],
    });

    expect(result).toEqual([{ id: 1 }]);
    expect(dataSource.get.mock.calls).toMatchSnapshot();

    ApollosConfig.loadJs({
      ROCK: {
        API_URL: 'https://apollosrock.newspring.cc/api',
        API_TOKEN: 'some-rock-token',
        IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
        USE_PLUGIN: true,
      },
    });
  });
  it('fetches interactions without throwing an error for a logged out user', async () => {
    const dataSource = new Interactions();
    dataSource.initialize({ context });
    dataSource.get = buildGetMock([{ Id: 1 }], ds);
    dataSource.context.dataSources.Auth.getCurrentPerson = () => {
      throw new AuthenticationError();
    };

    const result = await dataSource.getNodeInteractionsForCurrentUser({
      nodeId: createGlobalId(1, 'UniversalContentItem'),
      actions: ['READ', 'COMPLETE'],
    });

    expect(result).toEqual([]);
    expect(dataSource.get.mock.calls).toMatchSnapshot();
  });
});
