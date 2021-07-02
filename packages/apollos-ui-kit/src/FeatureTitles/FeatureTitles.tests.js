import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import FeatureTitles from '.';

describe('FeatureTitles', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <FeatureTitles
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          subtitle={'Luke, I am your father'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render loading state', () => {
    const tree = renderer.create(
      <Providers>
        <FeatureTitles isLoading />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass style', () => {
    const backgroundColor = { backgroundColor: 'red' };
    const tree = renderer.create(
      <Providers>
        <FeatureTitles style={backgroundColor} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
