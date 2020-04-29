import React from 'react';
import renderer from 'react-test-renderer';
import { TouchableWithoutFeedback } from 'react-native';
import { get } from 'lodash';

import Providers from '../Providers';
import ContentCard from '../ContentCard';

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
  it('renders custom loading data', () => {
    const tree = renderer.create(
      <Providers>
        <FeedView
          isLoading
          loadingStateData={[
            { id: 'customFakeData', content: 'really custom' },
          ]}
          content={[]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('handles a renderItem prop', () => {
    const renderItem = (item) => {
      const theItem = get(item, 'item', {});
      return (
        <TouchableWithoutFeedback>
          <ContentCard
            id={theItem.node.id}
            title={theItem.node.title}
            coverImage={theItem.node.coverImage}
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
});
