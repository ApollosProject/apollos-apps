import React from 'react';
import renderer from 'react-test-renderer';

import TestProviders from 'TestProviders';

import ErrorCard from './';

describe('the Card component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <TestProviders>
        <ErrorCard message={'Boom!'} error={'What?'} />
      </TestProviders>
    );

    expect(tree).toMatchSnapshot();
  });
});
