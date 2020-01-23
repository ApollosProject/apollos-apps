import React from 'react';
import { Providers, renderWithApolloData } from '../utils/testUtils';

import getShareContent from './getShareContent';

import ShareButtonConnected from '.';

const shareMock = {
  request: {
    query: getShareContent,
    variables: { itemId: '1' },
  },
  result: {
    data: {
      node: {
        id: '1',
        __typename: 'ContentSeriesContentItem',
        sharing: {
          url: 'https://apolloschurchapp.newspring.cc',
          title: 'Test Title ',
          __typename: 'SharableContentItem',
        },
      },
    },
  },
};

const mocks = [shareMock];

describe('the ShareButtonConnected', () => {
  it('renders a share button', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <ShareButtonConnected itemId={'1'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a share button with custom url, and title', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <ShareButtonConnected
          itemId={'1'}
          url={'https://apollosrock.com'}
          title="Some great title"
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
