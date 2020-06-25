import React from 'react';
import renderer from 'react-test-renderer';
import moment from 'moment';

import Providers from '../Providers';
import { H3 } from '../typography';

import ActionList from '.';

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
  {
    id: 'fakeId5',
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

const eventActions = actions.map((action, i) => ({
  ...action,
  image: null,
  start: moment(`November ${i + 1}, 2020`).toJSON(),
}));

describe('ActionList', () => {
  it('should render 5 items', () => {
    const tree = renderer.create(
      <Providers>
        <ActionList actions={actions} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without a "card border"', () => {
    const tree = renderer.create(
      <Providers>
        <ActionList actions={actions} isCard={false} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a header', () => {
    const tree = renderer.create(
      <Providers>
        <ActionList
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
  it('should render items as "touchable via onPressActionItem', () => {
    const tree = renderer.create(
      <Providers>
        <ActionList actions={actions} onPressActionItem={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with onPressActionListButton', () => {
    const tree = renderer.create(
      <Providers>
        <ActionList
          actions={actions}
          actionListButtonTitle="Press Me!"
          onPressActionListButton={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with events', () => {
    const tree = renderer.create(
      <Providers>
        <ActionList
          actions={eventActions}
          actionListButtonTitle="Press Me!"
          onPressActionListButton={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <ActionList
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
