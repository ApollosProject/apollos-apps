import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import AvatarCloud from '.';

const avatars = [
  'https://picsum.photos/200?1',
  'https://picsum.photos/200?2',
  'https://picsum.photos/200?3',
];

describe('The AvatarCloud component', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });
  afterEach(() => {
    global.Math.random.mockRestore();
  });
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={avatars} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render as radial', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={avatars} radial />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render without blur effect', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={avatars} blur={false} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render as isLoading', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={['', '', '']} primaryAvatar={''} isLoading />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept a maxAvatarWidth', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={avatars} maxAvatarWidth={0.1} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept a minAvatarWidth', () => {
    const tree = renderer.create(
      <Providers>
        <AvatarCloud avatars={avatars} minAvatarWidth={1} />
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
