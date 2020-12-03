import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

import SlideContent from '.';

describe('The Onboarding Slide component', () => {
  it('should render an icon', () => {
    const tree = renderer.create(
      <Providers>
        <SlideContent icon />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom icon', () => {
    const tree = renderer.create(
      <Providers>
        <SlideContent icon={'umbrella'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a title', () => {
    const tree = renderer.create(
      <Providers>
        <SlideContent title={'Whoa, this is heavy'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a description', () => {
    const tree = renderer.create(
      <Providers>
        <SlideContent
          description={
            'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with children', () => {
    const tree = renderer.create(
      <Providers>
        <SlideContent
          title={'Whoa, this is heavy'}
          description={
            'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
          }
        >
          <Text>Great Scott!</Text>
        </SlideContent>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render children alone', () => {
    const tree = renderer.create(
      <Providers>
        <SlideContent>
          <Text>Great Scott!</Text>
        </SlideContent>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <SlideContent
          title={'Whoa, this is heavy'}
          description={
            'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
          }
          icon
          isLoading
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render accept additionall props', () => {
    const centeredContent = { flex: 1, justifyContent: 'center' };
    const tree = renderer.create(
      <Providers>
        <SlideContent style={centeredContent}>
          <Text>Great Scott!</Text>
        </SlideContent>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
