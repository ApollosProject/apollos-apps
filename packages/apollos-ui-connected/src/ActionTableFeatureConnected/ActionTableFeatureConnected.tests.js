import React from 'react';

import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_ACTION_TABLE_FEATURE from './getActionTableFeature';
import ActionTableFeatureConnected from './index';

const mock = {
  request: {
    query: GET_ACTION_TABLE_FEATURE,
    variables: { featureId: 'ActionTableFeature:123' },
  },
  result: {
    data: {
      node: {
        id: 'ActionTableFeatureConnected:123',
        __typename: 'ActionTableFeature',
        title: 'Some cool list',
        actions: [
          {
            __typename: 'ActionTableAction',
            id: 'ActionTableAction:123',
            title: 'Boom',
            action: 'OPEN_URL',
            relatedNode: {
              __typename: 'Url',
              id: 'Url:123',
              url: 'http://www.google.com',
            },
          },
        ],
      },
    },
  },
};

describe('The ActionTableFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <ActionTableFeatureConnected
          refetchRef={jest.fn()}
          featureId={'ActionTableFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
