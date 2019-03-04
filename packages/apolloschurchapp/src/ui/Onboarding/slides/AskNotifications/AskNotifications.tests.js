import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import AskNotifications from '.';

describe('The Onboarding AskNotifications component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide component', () => {
    const tree = renderer.create(
      <Providers>
        <AskNotifications
          onPressSecondary={jest.fn()}
          secondaryNavText={'Later'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
