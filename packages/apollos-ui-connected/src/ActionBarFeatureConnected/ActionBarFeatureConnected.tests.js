import React from 'react';
import renderer from 'react-test-renderer';

import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_ACTION_BAR_FEATURE from './getActionBarFeature';
import ActionBarFeatureConnected from './index';

const mock = {
  request: {
    query: GET_ACTION_BAR_FEATURE,
    variables: { featureId: 'ActionBarFeature:123' },
  },
  result: {
    data: {
      node: {
        id: 'ActionBarFeatureConnected:123',
        __typename: 'ActionBarFeature',
        title: 'Some cool list',
        actions: [
          {
            __typename: 'ActionBarAction',
            id: 'ActionBarAction:123',
            title: 'Boom',
            icon: 'check',
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

describe('The ActionBarFeatureConnected component', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <ActionBarFeatureConnected
          refetchRef={jest.fn()}
          featureId={'ActionBarFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state when isLoading', async () => {
    const tree = renderer.create(
      <Providers MockedProvider={MockedProvider} mocks={[mock]}>
        <ActionBarFeatureConnected
          refetchRef={jest.fn()}
          featureId={'ActionBarFeature:123'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
