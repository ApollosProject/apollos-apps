import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';
import { CardLabel } from '../Card';

import DefaultCard from '.';

describe('DefaultCard', () => {
  it('should render at the minAspectRatio bound (tall-ish)', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
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
  it('should render at the images natural aspect ratio (between min/max)', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/1400/800/?random',
            },
          ]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render at the maxAspectRatio bound (wider than tall)', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/2000/800/?random',
            },
          ]}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a summary', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
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
  it('should should render a like icon', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          isLiked={false}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should should render as isLiked', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
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
  it('should render a loading state with isLoading', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
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
          isLoading
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with custom LabelComponent', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          LabelComponent={
            <CardLabel title={'Custom LabelComponent'} type={'primary'} />
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with custom labelText', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          labelText={'Custom label text'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with isLive support', () => {
    const tree = renderer.create(
      <Providers>
        <DefaultCard
          title={
            'Are you telling me that you built a time machine out of a DeLorean?'
          }
          coverImage={[
            {
              uri: 'https://picsum.photos/800/1600/?random',
            },
          ]}
          isLive
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
