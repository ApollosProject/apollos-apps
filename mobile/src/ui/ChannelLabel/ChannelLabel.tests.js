import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'TestProviders';
import ChannelLabel from './';

describe('the FeedItemCard ChannelLabel component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ChannelLabel label={'Default'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom icon', () => {
    const tree = renderer.create(
      <Providers>
        <ChannelLabel label={'Default'} icon={'like'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a skeleton view', () => {
    const tree = renderer.create(
      <Providers>
        <ChannelLabel label={'Default'} isLoading />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
