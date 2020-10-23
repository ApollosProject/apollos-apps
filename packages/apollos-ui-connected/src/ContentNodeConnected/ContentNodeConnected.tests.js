import React from 'react';
import { Text } from 'react-native';
import { Providers, renderWithApolloData } from '../testUtils';

import MediaControlsConnected, {
  GET_NODE_MEDIA,
} from '../MediaControlsConnected';
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

const mediaMock = {
  request: {
    query: GET_NODE_MEDIA,
    variables: {
      nodeId: 'WeekendContentItem:1',
    },
  },
  result: {
    data: {
      node: {
        id: 'WeekendContentItem:1',
        __typename: 'WeekendContentItem',
        videos: [
          {
            __typename: 'VideoMedia',
            sources: [
              {
                uri: 'https://somevideo.com/video.bin',
                __typename: 'VideoMediaSource',
              },
            ],
          },
        ],
      },
    },
  },
};

describe('ContentNodeConnected', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={[contentMock]}>
        <ContentNodeConnected nodeId={'WeekendContentItem:1'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with media player', async () => {
    const Component = (props) => <Text>{JSON.stringify(props)}</Text>;
    const MediaControlsConnectedShallow = (props) => (
      <MediaControlsConnected {...props} Component={Component} />
    );
    const tree = await renderWithApolloData(
      <Providers mocks={[mediaMock, contentMock]}>
        <ContentNodeConnected
          MediaControlsComponent={MediaControlsConnectedShallow}
          nodeId={'WeekendContentItem:1'}
        />
      </Providers>
    );
    const finalTree = await renderWithApolloData(
      <Providers mocks={[contentMock, mediaMock]}>
        <ContentNodeConnected
          MediaControlsComponent={MediaControlsConnectedShallow}
          nodeId={'WeekendContentItem:1'}
        />
      </Providers>,
      tree
    );
    expect(finalTree).toMatchSnapshot();
  });
});
