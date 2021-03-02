import React from 'react';
import renderer from 'react-test-renderer';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import { Providers } from '@apollosproject/ui-test-utils';

import Follow from './Follow';

describe('The Onboarding Follow component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Follow />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom first name', () => {
    const tree = renderer.create(
      <Providers>
        <Follow firstName={'firstName'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <Follow slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <Follow description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a BackgroundComponent', () => {
    const tree = renderer.create(
      <Providers>
        <Follow
          BackgroundComponent={
            <GradientOverlayImage
              source={'https://picsum.photos/375/812/?random'}
            />
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide', () => {
    const tree = renderer.create(
      <Providers>
        <Follow onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
