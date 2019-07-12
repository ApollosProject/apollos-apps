import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';

import FeaturedCard from '.';

storiesOf('ui-kit/FeaturedCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => (
    <FeaturedCard
      title={'Boom'}
      image={[
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ]}
    />
  ));
