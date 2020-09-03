import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../../testUtils';

import ActionListFeature from '.';

const actions = [
  {
    id: 'fakeId1',
    title: 'Boom',
    subtitle: 'What',
    parentChannel: {
      id: '',
      name: '',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/200/200',
        },
      ],
    },
  },
  {
    id: 'fakeId2',
    title: 'Boom',
    subtitle: 'What',
    parentChannel: {
      id: '',
      name: '',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/200',
        },
      ],
    },
  },
  {
    id: 'fakeId3',
    title: 'Boom',
    subtitle: 'What',
    parentChannel: {
      id: '',
      name: '',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/200',
        },
      ],
    },
  },
  {
    id: 'fakeId4',
    title: 'Boom',
    subtitle: 'What',
    parentChannel: {
      id: '',
      name: '',
    },
    image: {
      sources: [
        {
          uri: 'https://picsum.photos/200',
        },
      ],
    },
  },
];

describe('The ActionListFeatures component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListFeature actions={actions} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a title', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListFeature
          actions={actions}
          title={'This renders smaller than its name would suggest'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a subtitle', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListFeature
          actions={actions}
          subtitle={'This renders larger than you might expect'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a button for onPressActionListButton', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListFeature
          actions={actions}
          primaryAction={{ title: 'Foo ' }}
          onPressActionListButton={jest.fn()}
          actionListTitle
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state for isLoading', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListFeature actions={[]} isLoading />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should not render with no actions', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListFeature actions={[]} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
