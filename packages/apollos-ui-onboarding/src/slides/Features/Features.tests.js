import React from 'react';
import renderer from 'react-test-renderer';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import { Providers } from '@apollosproject/ui-test-utils';

import Features from './Features';

describe('The Onboarding Features component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Features />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom first name', () => {
    const tree = renderer.create(
      <Providers>
        <Features firstName={'firstName'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <Features slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <Features description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a BackgroundComponent', () => {
    const tree = renderer.create(
      <Providers>
        <Features
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
        <Features onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
