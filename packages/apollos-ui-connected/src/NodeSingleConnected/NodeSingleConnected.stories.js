import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { times } from 'lodash';
import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import {
  ApolloStorybookDecorator,
  WithReactNavigator,
} from '@apollosproject/ui-test-utils';
import NodeSingleConnected from './index';

const devoMock = (root, { id }) => ({
  id,
  __typename: 'DevotionalContentItem',
  videos: [],
  theme: null,
  summary: 'bla bla bla',
  coverImage: {
    name: 'Square image',
    __typename: 'ImageMedia',
    sources: [
      {
        uri:
          'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
        __typename: 'ImageMediaSource',
      },
    ],
  },
  parentChannel: {
    id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
    name: 'Devotional',
    iconName: 'text',
    __typename: 'ContentChannel',
  },
  title: `Devo #${id.split(':')[1]}`,
  hyphenatedTitle: `Devo #${id.split(':')[1]}`,
  sharing: {
    url:
      'https://apollosrock.newspring.cc/devotional/god-sees-who-you-can-be-not-who-you-are',
    message:
      'God sees who you can be not who you are - Life is challenging enough.',
    title: 'Share via ...',
    __typename: 'SharableContentItem',
  },
  siblingContentItemsConnection: (_root, { after = 0 }) => ({
    edges: times(10, (index) => ({
      node: {
        id: `DevotionalContentItem:${index + Number(after)}`,
        __typename: 'DevotionalContentItem',
        videos: [],
        theme: null,
        summary: 'bla bla bla',
        coverImage: {
          name: 'Square image',
          __typename: 'ImageMedia',
          sources: [
            {
              uri:
                'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
              __typename: 'ImageMediaSource',
            },
          ],
        },
        parentChannel: {
          id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
          name: 'Devotional',
          iconName: 'text',
          __typename: 'ContentChannel',
        },
        title: `Devo #${index + Number(after)}`,
        hyphenatedTitle: `Devo #${index + Number(after)}`,
        sharing: {
          url:
            'https://apollosrock.newspring.cc/devotional/god-sees-who-you-can-be-not-who-you-are',
          message:
            'God sees who you can be not who you are - Life is challenging enough.',
          title: 'Share via ...',
          __typename: 'SharableContentItem',
        },
      },
      cursor: index + Number(after),
    })),
  }),
});

const nodeMock = (root, args) =>
  console.warn(args, root, 'from node') || {
    id: args.id,
    __typename: args.id.split(':')[0],
    title: 'Some title',
    htmlContent:
      '<p>Of Myths and Money, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim euismod arcu, volutpat feugiat tortor luctus vitae. Suspendisse efficitur faucibus ante at facilisis. Phasellus in velit suscipit lectus tempus dapibus vitae eu quam. Fusce venenatis mauris non ante scelerisque, sit amet blandit odio ultricies. In sed lacinia dui, eu blandit metus. Ut ante enim, facilisis sed pretium et, posuere vitae felis. Phasellus ornare mauris mauris, eget pretium nibh imperdiet ac. Integer eleifend dui ut nisl sagittis mattis. Nunc consectetur consequat tristique. Pellentesque luctus tortor nec quam pulvinar iaculis.</p>',
    coverImage: {
      sources: [{ uri: 'https://picsum.photos/id/200/400/600' }],
    },
    features: null,
    ...(args.id.includes('WeekendContentItem')
      ? {
          liveStream: {
            isLive: true,
            media: {
              sources: [
                {
                  uri:
                    'http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8',
                },
              ],
            },
          },
          childContentItemsConnection: { edges: [] },
        }
      : {}),
    ...(args.id.includes('Media')
      ? {
          videos: [
            {
              sources:
                args.id === 'MediaContentItem:123'
                  ? [
                      {
                        uri:
                          'http://embed.wistia.com/deliveries/0e364f7e6f6604384ece8a35905a53a864386e9f.bin',
                        __typename: 'ImageMediaSource',
                      },
                    ]
                  : [],
            },
          ],
        }
      : { videos: null }),
    ...(args.id.includes('Series')
      ? {
          childContentItemsConnection: (_root, { after = 0 }) => ({
            edges: times(10, (index) => ({
              node: {
                id: `DevotionalContentItem:${index + Number(after)}`,
                __typename: 'DevotionalContentItem',
                videos: [],
                theme: null,
                summary: 'bla bla bla',
                coverImage: {
                  name: 'Square image',
                  __typename: 'ImageMedia',
                  sources: [
                    {
                      uri:
                        'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3D31af1a61-360c-4b1e-8e62-45517c06a9a2',
                      __typename: 'ImageMediaSource',
                    },
                  ],
                },
                parentChannel: {
                  id: 'ContentChannel:559b23fd0aa90e81b1c023e72e230fa1',
                  name: 'Devotional',
                  iconName: 'text',
                  __typename: 'ContentChannel',
                },
                title: `Devo #${index + Number(after)}`,
                hyphenatedTitle: `Devo #${index + Number(after)}`,
                sharing: {
                  url:
                    'https://apollosrock.newspring.cc/devotional/god-sees-who-you-can-be-not-who-you-are',
                  message:
                    'God sees who you can be not who you are - Life is challenging enough.',
                  title: 'Share via ...',
                  __typename: 'SharableContentItem',
                },
              },
              cursor: index + Number(after),
            })),
          }),
        }
      : {}),
  };

const mocks = {
  Query: () => ({
    node: (root, args) =>
      args.id.includes('Devotional')
        ? devoMock(root, args)
        : nodeMock(root, args),
  }),
};

storiesOf('ui-connected/NodeSingleConnected', module)
  .addDecorator((story) =>
    WithReactNavigator(
      <BackgroundView>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
      </BackgroundView>
    )
  )
  .addDecorator(ApolloStorybookDecorator({ mocks }))
  .add('example', () => (
    <NodeSingleConnected nodeId={'UniversalContentItem:123'} />
  ))
  .add('with media', () => (
    <NodeSingleConnected nodeId={'MediaContentItem:123'} />
  ))
  .add('with with livestream', () => (
    <NodeSingleConnected nodeId={'WeekendContentItem:123'} />
  ))
  .add('with no media', () => (
    <NodeSingleConnected nodeId={'MediaContentItem:456'} />
  ))
  .add('with children', () => (
    <NodeSingleConnected nodeId={'ContentSeriesContentItem:123'} />
  ))
  .add('with siblings', () => (
    <NodeSingleConnected nodeId={'DevotionalContentItem:123'} />
  ));
// .add('with stretchy', () => (
//   <StretchyView>
//     {({ Stretchy, ...scrollViewProps }) => (
//       <FlexedScrollView {...scrollViewProps}>
//         <ContentNodeConnected
//           ImageWrapperComponent={Stretchy}
//           nodeId={'UniversalContentItem:123'}
//         />
//       </FlexedScrollView>
//     )}
//   </StretchyView>
// ));
