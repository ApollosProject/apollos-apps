import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import AvatarList from '.';

const avatars = [
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
];

describe('The AvatarList component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarList avatars={avatars} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const emptyData = [
      {
        id: '1',
        source: { uri: '' },
      },
      {
        id: '2',
        source: { uri: '' },
      },
      {
        id: '3',
        source: { uri: '' },
      },
      {
        id: '4',
        source: { uri: '' },
      },
      {
        id: '5',
        source: { uri: '' },
      },
      {
        id: '6',
        source: { uri: '' },
      },
      {
        id: '7',
        source: { uri: '' },
      },
      {
        id: '8',
        source: { uri: '' },
      },
    ];
    const tree = renderer.create(
      <Providers>
        <AvatarList avatars={emptyData} isLoading onPressAdd={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressAdd function', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarList avatars={avatars} onPressAdd={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressAdd function', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarList avatars={avatars} onPressAdd={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressAvatar function', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarList avatars={avatars} onPressAvatar={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
