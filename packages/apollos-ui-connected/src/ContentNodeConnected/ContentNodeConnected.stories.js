import React from 'react';
import { Animated } from 'react-native';

import { storiesOf } from '@apollosproject/ui-storybook';

import {
  BackgroundView,
  CenteredView,
  styled,
  StretchyView,
} from '@apollosproject/ui-kit';
import { ApolloStorybookDecorator } from '../testUtils';
import ContentNodeConnected from './ContentNodeConnected';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const mocks = {
  Query: () => ({
    node: (root, args) => ({
      id: args.id,
      __typename: args.id.split(':')[0],
      title: 'Some title',
      htmlContent:
        '<p>Of Myths and Money, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim euismod arcu, volutpat feugiat tortor luctus vitae. Suspendisse efficitur faucibus ante at facilisis. Phasellus in velit suscipit lectus tempus dapibus vitae eu quam. Fusce venenatis mauris non ante scelerisque, sit amet blandit odio ultricies. In sed lacinia dui, eu blandit metus. Ut ante enim, facilisis sed pretium et, posuere vitae felis. Phasellus ornare mauris mauris, eget pretium nibh imperdiet ac. Integer eleifend dui ut nisl sagittis mattis. Nunc consectetur consequat tristique. Pellentesque luctus tortor nec quam pulvinar iaculis.</p>',
      coverImage: {
        sources: [{ uri: 'https://picsum.photos/2000/200/?random' }],
      },
      ...(args.id.includes('Media')
        ? {
            videos: [
              {
                sources: [
                  {
                    uri:
                      'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
                  },
                ],
              },
            ],
          }
        : { videos: [] }),
    }),
  }),
};

storiesOf('ui-connected/ContentNodeConnected', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <ContentNodeConnected nodeId={'UniversalContentItem:123'} />
  ))
  .add('with media', () => (
    <ContentNodeConnected nodeId={'MediaContentItem:123'} />
  ))
  .add('with stretchy', () => (
    <StretchyView>
      {({ Stretchy, ...scrollViewProps }) => (
        <FlexedScrollView {...scrollViewProps}>
          <ContentNodeConnected
            ImageWrapperComponent={Stretchy}
            nodeId={'UniversalContentItem:123'}
          />
        </FlexedScrollView>
      )}
    </StretchyView>
  ));
