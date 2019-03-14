import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import Launch from '.';

describe('The Onboarding SlideWrapper component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Launch />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <Launch slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <Launch description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to SlideWrapper', () => {
    const tree = renderer.create(
      <Providers>
        <Launch onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
