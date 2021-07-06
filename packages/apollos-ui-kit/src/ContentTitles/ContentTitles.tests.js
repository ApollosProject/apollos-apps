import React from 'react';
import renderer from 'react-test-renderer';
import Providers from '../Providers';

import ContentTitles from './ContentTitles';

describe('The ContentTitles component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <ContentTitles
          title={'This is a large title'}
          summary={'This is a short summary of this content.'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render social buttons', () => {
    const tree = renderer.create(
      <Providers>
        <ContentTitles
          title={'This is a large title'}
          summary={'This is a short summary of this content.'}
          onPressLike={() => {}}
          onPressShare={() => {}}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should feature', () => {
    const tree = renderer.create(
      <Providers>
        <ContentTitles
          title={'This is a large title'}
          summary={'This is a short summary of this content.'}
          featured
          onPressLike={() => {}}
          onPressShare={() => {}}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should micro', () => {
    const tree = renderer.create(
      <Providers>
        <ContentTitles
          title={'This is a large title'}
          summary={'This is a short summary of this content.'}
          micro
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
