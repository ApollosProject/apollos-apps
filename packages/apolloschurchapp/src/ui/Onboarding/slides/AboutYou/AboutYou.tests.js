import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import AboutYou from '.';

describe('The Onboarding AboutYou component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom image', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should show users gender', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou gender={'Male'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should display custom birthday', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou birthday={new Date('02/14/1989')} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide', () => {
    const tree = renderer.create(
      <Providers>
        <AboutYou onPressPrimary={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
