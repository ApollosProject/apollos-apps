import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_FEATURE_FEED from './getFeatureFeed';

import FeaturesFeedConnected from './FeaturesFeedConnected';

const mock = {
  request: {
    query: GET_FEATURE_FEED,
    variables: {
      featureFeedId: 'FeatureFeed:1',
    },
  },
  result: {
    data: {
      node: {
        id: 'FeatureFeed:1',
        features: [
          {
            id: 'WebviewFeature:6',
            title: 'Test Title',
            __typename: 'WebviewFeature',
          },
          {
            id: 'TextFeature:1',
            body: 'this is another, text feature',
            scriptures: [
              {
                id: 'Scripture:2',
                reference: 'Matthew 4:10',
                __typename: 'Scripture',
              },
            ],
            __typename: 'TextFeature',
          },
          {
            id: 'ScriptureFeature:3',
            scriptures: [
              {
                id: 'Scripture:4',
                reference: 'Mark 1:12',
                __typename: 'Scripture',
              },
            ],
            __typename: 'ScriptureFeature',
          },
          {
            id: 'ScriptureFeature:4',
            scriptures: [
              {
                id: 'Scripture:5',
                reference: 'John 3:16',
                __typename: 'Scripture',
              },
            ],
            __typename: 'ScriptureFeature',
          },
        ],
        __typename: 'WeekendContentItem',
      },
    },
  },
};

describe('FeaturesFeedConnected', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <FeaturesFeedConnected featureFeedId={'FeatureFeed:1'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
