import React from 'react';
import renderer from 'react-test-renderer';
import Providers from '../Providers';

import SocialBar from './SocialBar';

describe('The SocialBar component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <SocialBar onPressLike={() => {}} onPressShare={() => {}} isLiked />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should toggle liked', () => {
    const tree = renderer.create(
      <Providers>
        <SocialBar
          onPressLike={() => {}}
          onPressShare={() => {}}
          isLiked={false}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should show only buttons given', () => {
    const tree = renderer.create(
      <Providers>
        <SocialBar onPressLike={() => {}} />
        <SocialBar onPressShare={() => {}} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
