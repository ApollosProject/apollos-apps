import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { dataSource as Interactions } from '../index';
import { buildGetMock } from '../../test-utils';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
    IMAGE_URL: 'https://apollosrock.newspring.cc/GetImage.ashx',
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
    },
    Auth: {
      getCurrentPerson: buildGetMock({ Id: 456, PrimaryAliasId: 456 }, ds),
    },
  },
};

describe('Interactions', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('creates a new interaction', async () => {
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
});
