import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import GET_CONTENT_NODE from './getContentNode';

import ContentNodeConnected from './ContentNodeConnected';

const contentMock = {
  request: {
    query: GET_CONTENT_NODE,
    variables: {
      nodeId: 'WeekendContentItem:1',
    },
  },
  result: {
    data: {
      node: {
        __typename: 'WeekendContentItem',
        id: 'WeekendContentItem:1',
        title: 'Here is the title',
        htmlContent:
          '<p>Of Myths and Money, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim euismod arcu, volutpat feugiat tortor luctus vitae. Suspendisse efficitur faucibus ante at facilisis. Phasellus in velit suscipit lectus tempus dapibus vitae eu quam. Fusce venenatis mauris non ante scelerisque, sit amet blandit odio ultricies. In sed lacinia dui, eu blandit metus. Ut ante enim, facilisis sed pretium et, posuere vitae felis. Phasellus ornare mauris mauris, eget pretium nibh imperdiet ac. Integer eleifend dui ut nisl sagittis mattis. Nunc consectetur consequat tristique. Pellentesque luctus tortor nec quam pulvinar iaculis.</p>',
        coverImage: {
          __typename: 'ImageMedia',
          sources: [
            {
              __typename: 'ImageMediaSource',
              uri: 'https://picsum.photos/2000/200/?random',
            },
          ],
        },
      },
    },
  },
};

describe('ContentNodeConnected', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[contentMock]}>
        <ContentNodeConnected nodeId={'WeekendContentItem:1'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
