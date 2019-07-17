import React from 'react';
import renderer from 'react-test-renderer';
import Providers from '../Providers';

import FeaturedCard from '.';

describe('FeaturedCard', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          image={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom actionIcon', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          image={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          actionIcon={'umbrella'}
          onPressAction={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a description', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          image={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          description={
            'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should should render as isLiked', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          image={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          isLiked
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with custom labelText', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          image={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          labelText={'Quote'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render correctly with "Live" labelText', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          image={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          labelText={'Live'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a default actionIcon ("play") with onPressAction', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          image={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          onPressAction={jest.fn()}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom theme', () => {
    const tree = renderer.create(
      <Providers>
        <FeaturedCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          image={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          theme={{
            colors: {
              primary: 'salmon',
            },
          }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
