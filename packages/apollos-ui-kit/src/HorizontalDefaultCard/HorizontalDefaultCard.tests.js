import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import HorizontalDefaultCard from '.';

describe('HorizontalDefaultCard', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <HorizontalDefaultCard
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should should render a like icon', () => {
    const tree = renderer.create(
      <Providers>
        <HorizontalDefaultCard
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          isLiked={false}
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should should render as isLiked', () => {
    const tree = renderer.create(
      <Providers>
        <HorizontalDefaultCard
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          isLiked
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state with isLoading', () => {
    const tree = renderer.create(
      <Providers>
        <HorizontalDefaultCard
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          isLoading
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          summary={
            'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a title', () => {
    const tree = renderer.create(
      <Providers>
        <HorizontalDefaultCard
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          isLoading
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a summary', () => {
    const tree = renderer.create(
      <Providers>
        <HorizontalDefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          summary={
            'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
