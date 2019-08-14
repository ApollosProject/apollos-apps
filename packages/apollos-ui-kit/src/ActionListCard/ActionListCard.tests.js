import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';
import { H3 } from '../typography';

import ActionListCard from '.';

const actions = [
  {
    id: 'fakeId1',
    title: 'Hello 1',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400?random',
      },
    },
  },
  {
    id: 'fakeId2',
    title: 'Hello 2',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400?random',
      },
    },
  },
  {
    id: 'fakeId3',
    title: 'Hello 3',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400?random',
      },
    },
  },
  {
    id: 'fakeId4',
    title: 'Hello 4',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400?random',
      },
    },
  },
];

describe('ActionListCard', () => {
  it('should render 4 items', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListCard onPress={() => {}} actions={actions} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a header', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListCard
          onPress={jest.fn()}
          actions={actions}
          header={
            <H3 numberOfLines={3} ellipsizeMode="tail">
              Custom Header Element
            </H3>
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with onPressActionListButton', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListCard
          onPress={() => {}}
          actions={actions}
          onPressActionListButton={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListCard
          onPress={jest.fn()}
          isLoading
          actions={actions}
          onPressActionListButton={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
