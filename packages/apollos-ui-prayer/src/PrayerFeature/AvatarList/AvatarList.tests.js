import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../../testUtils';

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
    const tree = renderer.create(
      <Providers>
        <AvatarList avatars={avatars} isLoading />
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
