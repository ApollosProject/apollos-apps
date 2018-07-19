import React from 'react';
import renderer from 'react-test-renderer';
import { TouchableWithoutFeedback } from 'react-native';
import { get } from 'lodash';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Providers from 'Providers';
import FeedItemCard from 'ui/FeedItemCard';

import FeedView from '.';

describe('The FeedView component', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Providers>
        <FeedView
          content={[
            {
              node: {
                id: '1',
                title: "Will I get to shake Jesus' hand?",
                coverImage: [
                  {
                    uri: 'https://picsum.photos/600/400/?random',
                    width: 600,
                    height: 400,
                  },
                ],
                theme: {
                  isLight: true,
                  colors: {
                    background: {
                      paper: '#fa8072',
                    },
                  },
                },
                parentChannel: {
                  id: '01',
                  name: 'eschatology',
                  iconName: 'like',
                },
              },
            },
            {
              node: {
                id: '2',
                title: 'Where is the new Jerusalem anyways?',
                coverImage: [
                  {
                    uri: 'https://picsum.photos/600/400/?random',
                    width: 600,
                    height: 400,
                  },
                ],
                theme: {
                  isLight: true,
                  colors: {
                    background: {
                      paper: '#e9967a',
                    },
                  },
                },
                parentChannel: {
                  id: '02',
                  name: 'eschatology',
                  iconName: 'like',
                },
              },
            },
          ]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders empty state', () => {
    const tree = renderer.create(
      <Providers>
        <FeedView isLoading content={[]} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('handles a renderItem prop', () => {
    const renderItem = (item) => {
      const theItem = get(item, 'item', {});
      return (
        <TouchableWithoutFeedback>
          <FeedItemCard
            id={theItem.node.id}
            title={theItem.node.title || theItem.node.name || ' '}
            channelType={theItem.node.parentChannel.name}
            channelTypeIcon={theItem.node.parentChannel.iconName}
            images={theItem.node.coverImage.sources}
            isLoading={theItem.node.isLoading}
          />
        </TouchableWithoutFeedback>
      );
    };

    const tree = renderer.create(
      <Providers>
        <FeedView
          isLoading
          content={[
            {
              node: {
                id: '1',
                title: "Will I get to shake Jesus' hand?",
                coverImage: [
                  {
                    uri: 'https://picsum.photos/600/400/?random',
                    width: 600,
                    height: 400,
                  },
                ],
                theme: {
                  isLight: true,
                  colors: {
                    background: {
                      paper: '#fa8072',
                    },
                  },
                },
                parentChannel: {
                  id: '01',
                  name: 'eschatology',
                  iconName: 'like',
                },
              },
            },
          ]}
          renderItem={renderItem}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('passes an onPressItem prop', () => {
    const onPress = () => {};
    const tree = renderer.create(
      <Providers>
        <FeedView isLoading content={[]} onPressItem={onPress} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders using shallow from enzyme', () => {
    const onPressItemSpy = sinon.spy();
    const content = [
      {
        node: {
          id: '1',
          title: "Will I get to shake Jesus' hand?",
          coverImage: [
            {
              uri: 'https://picsum.photos/600/400/?random',
              width: 600,
              height: 400,
            },
          ],
          theme: {
            isLight: true,
            colors: {
              background: {
                paper: '#fa8072',
              },
            },
          },
          parentChannel: {
            id: '01',
            name: 'eschatology',
            iconName: 'like',
          },
        },
      },
    ];

    const wrapper = shallow(
      <FeedView content={content} onPressItem={onPressItemSpy} />
    );

    // This is a snapshot of the component at it's highest level.
    expect(wrapper).toMatchSnapshot();

    // This digs down into the component to get to the level where the
    // 'onPressItem' function can be reached.
    const render = wrapper
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive()
      .dive();

    // This is a snapshot of the component at this deep level.
    expect(render).toMatchSnapshot();

    // This simulates the press on the Touchable.
    render.forEach((child) => {
      child.simulate('pressItem');
    });

    // This tests whether or not the onPressItem function was called.
    expect(onPressItemSpy.calledOnce).toBe(true);

    // This gets the props off of the component at this level (where
    // "onPressItem" resides).
    const renderProps = render.props();

    // This actually runs the "renderItem" function and then creates a
    // snapshot of what the "renderItem" function returns.
    expect(renderProps.renderItem(content)).toMatchSnapshot();

    // Testing things here
    const thisThing = shallow(renderProps.renderItem(content));
    expect(thisThing.instance().props.onPress()).toMatchSnapshot();
  });
});
