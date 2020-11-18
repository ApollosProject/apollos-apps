import React from 'react';
import renderer from 'react-test-renderer';
import { ApollosPlayerContainer } from '../index';

describe('The media player', () => {
  it('renders', () => {
    const tree = renderer.create(<ApollosPlayerContainer />);
    expect(tree).toMatchSnapshot();
  });
});
