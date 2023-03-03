import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { ScrollView } from 'react-native';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';

import HighlightCard from './index';

storiesOf('ui-kit/HighlightCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('(deprecated)', () => (
    <ScrollView>
      <HighlightCard
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
        hasAction
        labelText={'Custom Label'}
      />
      <HighlightCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/1600/800/?random',
          },
        ]}
        summary={
          'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
        }
        hasAction
        isLiked={false}
        labelText={'Custom Label'}
      />
      <HighlightCard
        title={
          'Are you telling me that you built a time machine out of a DeLorean?'
        }
        coverImage={[
          {
            uri: 'https://picsum.photos/800/800/?random',
          },
        ]}
        summary={
          'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?'
        }
        hasAction
        isLiked
        labelText={'Custom Label'}
      />
    </ScrollView>
  ));
