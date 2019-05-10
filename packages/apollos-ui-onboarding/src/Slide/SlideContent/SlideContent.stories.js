import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import SlideContent from '.';

storiesOf('ui-onboarding/Slide/SlideContent', module)
  .add('example', () => (
    <SlideContent
      title={'Whoa, this is heavy'}
      description={
        'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
      }
      icon
    />
  ))
  .add('icon', () => <SlideContent icon />)
  .add('icon (custom name)', () => <SlideContent icon={'umbrella'} />)
  .add('title', () => <SlideContent title={'Whoa, this is heavy'} />)
  .add('description', () => (
    <SlideContent
      description={
        'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
      }
    />
  ))
  .add('isLoading', () => (
    <SlideContent
      title={'Whoa, this is heavy'}
      description={
        'There\'s that word again: "heavy." Why are things so heavy in the future? Is there a problem with the Earth\'s gravitational pull?'
      }
      icon
      isLoading
    />
  ))
  .add('childen', () => (
    <SlideContent>
      <Text>Great Scott!</Text>
    </SlideContent>
  ));
