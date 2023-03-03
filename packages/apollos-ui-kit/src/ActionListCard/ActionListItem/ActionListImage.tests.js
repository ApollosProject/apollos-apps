import React from 'react';
import renderer from 'react-test-renderer';

import moment from 'moment';
import Providers from '../../Providers';

import ActionListImage from './ActionListImage';

describe('ActionListImage', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListImage
          source={'https://picsum.photos/600/400/?random'}
          relatedNode={{}}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a date', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListImage
          source={null}
          relatedNode={{ start: moment('11/12/2020').toJSON() }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should not render with a date if it has an image', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListImage
          source={'https://picsum.photos/600/400/?random'}
          relatedNode={{ start: moment('11/12/2020').toJSON() }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListImage isLoading />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
