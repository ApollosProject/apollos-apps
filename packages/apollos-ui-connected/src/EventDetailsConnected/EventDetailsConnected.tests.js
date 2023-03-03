import React from 'react';

import { MockedProvider } from '@apollo/client/testing';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import getEvent from './getEvent';
import EventDetailsConnected from './index';

const mocks = {
  request: {
    query: getEvent,
    variables: { eventId: 'Event:123' },
  },
  result: {
    data: {
      node: {
        __typename: 'Event',
        id: 'Event:123',
        start: '2019-09-26T15:10:51.200Z',
        end: '2019-09-26T17:10:51.200Z',
        location: 'Willow Creek, Chicago',
        title: 'Cookout',
        htmlContent: 'Some detailed description',
        coverImage: {
          __typename: 'ImageMedia',
          sources: [
            {
              uri: 'https://url.com/image.jpg',
              __typename: 'ImageMediaSource',
            },
          ],
        },
      },
    },
  },
};

describe('EventConnected component', () => {
  it('renders without errors', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[mocks]} MockedProvider={MockedProvider}>
        <EventDetailsConnected nodeId={'Event:123'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
