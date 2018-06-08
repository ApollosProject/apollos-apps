import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'TestProviders';
import CategoryLabel from './';

describe('the FeedItemCard CategoryLabel component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <CategoryLabel label={'Default'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom icon', () => {
    const tree = renderer.create(
      <Providers>
        <CategoryLabel label={'Default'} icon={'like'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a skeleton view', () => {
    const tree = renderer.create(
      <Providers>
        <CategoryLabel label={'Default'} isLoading />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
