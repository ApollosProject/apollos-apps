import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import ContentTableCardItem from '.';

describe('ContentTableCardItem', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ContentTableCardItem
          onPress={() => {}}
          imageSource={'https://picsum.photos/600/400/?random'}
          title={'Boom'}
          id={'fakeID'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a label', () => {
    const tree = renderer.create(
      <Providers>
        <ContentTableCardItem
          onPress={() => {}}
          imageSource={'https://picsum.photos/600/400/?random'}
          title={'Boom'}
          label={'What'}
          id={'fakeID'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
