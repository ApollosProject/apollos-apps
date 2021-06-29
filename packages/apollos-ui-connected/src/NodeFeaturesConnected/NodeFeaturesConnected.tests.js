import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_NODE_FEED from './getNodeFeatures';

import NodeFeaturesConnected from './NodeFeaturesConnected';

jest.mock('../FeaturesFeedConnected', () => 'FeaturesFeedConnected');

describe('NodeFeaturesConnected', () => {
  it('should render', async () => {
    const nodeMock = {
      request: {
        query: GET_NODE_FEED,
        variables: {
          nodeId: 'WeekendContentItem:123',
        },
      },
      result: {
        data: {
          node: {
            id: 'WeekendContentItem:123',
            __typename: 'WeekendContentItem',
            featureFeed: {
              __typename: 'FeatureFeed',
              id: 'FeatureFeed:123',
            },
          },
        },
      },
    };
    const tree = await renderWithApolloData(
      <Providers mocks={[nodeMock]} MockedProvider={MockedProvider}>
        <NodeFeaturesConnected nodeId={'WeekendContentItem:123'} />
      </Providers>
    );
    await new Promise((res) => setTimeout(res, 5));
    expect(tree).toMatchSnapshot();
  });
});
