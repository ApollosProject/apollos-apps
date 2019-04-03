import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import AskName from '.';

describe('The Onboarding AskName component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <AskName
          values={{ email: '', password: '' }}
          touched={{ email: false, password: false }}
          errors={{ email: null, password: null }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <AskName
          values={{ email: '', password: '' }}
          touched={{ email: false, password: false }}
          errors={{ email: null, password: null }}
          slideTitle={'Custom title text'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <AskName
          values={{ email: '', password: '' }}
          touched={{ email: false, password: false }}
          errors={{ email: null, password: null }}
          description={'Custom description text'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide component', () => {
    const tree = renderer.create(
      <Providers>
        <AskName
          values={{ email: '', password: '' }}
          touched={{ email: false, password: false }}
          errors={{ email: null, password: null }}
          onPressPrimary={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
