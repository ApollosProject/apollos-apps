import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import ErrorCard from '.';

describe('the Card component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ErrorCard />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom message', () => {
    const tree = renderer.create(
      <Providers>
        <ErrorCard message={'Boom!'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render and not show the error message', () => {
    const tree = renderer.create(
      <Providers>
        <ErrorCard error={'What?'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with an error message inside an object', () => {
    const errorObject = {
      message: 'You have discovered an error message. Do you open it?',
    };
    const tree = renderer.create(
      <Providers>
        <ErrorCard error={errorObject} showErrorMessage />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with an error inside an object', () => {
    const errorObject = {
      error: 'Errors, errors, and more errors',
    };
    const tree = renderer.create(
      <Providers>
        <ErrorCard error={errorObject} showErrorMessage />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
