import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import AvatarCloud from '.';

const avatars = [
  'https://picsum.photos/200',
  'https://picsum.photos/200',
  'https://picsum.photos/200',
];

describe('The AvatarCloud component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={avatars} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept a maxAvatarSize', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={avatars} maxAvatarSize={10} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept a minAvatarSize', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={avatars} maxAvatarSize={100} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept a primaryAvatar', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud
          avatars={avatars}
          primaryAvatar={'https://picsum.photos/200'}
        />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
