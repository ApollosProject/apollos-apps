import React from 'react';
import renderer from 'react-test-renderer';
import Config from 'react-native-config';

import Providers from '../../Providers';

import ErrorCard from '.';

describe('the Card component', () => {
  beforeEach(() => {
    jest.mock('react-native-config');
    Config.SHOW_ERRORS = 'true';
  });
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ErrorCard message={'Boom!'} error={'What?'} />
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
        <ErrorCard error={errorObject} />
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
        <ErrorCard error={errorObject} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
