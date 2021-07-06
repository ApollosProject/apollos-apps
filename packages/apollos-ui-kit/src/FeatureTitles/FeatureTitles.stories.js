import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import BackgroundView from '../BackgroundView';
import CenteredView from '../CenteredView';
import FeatureTitles from './index';

storiesOf('ui-kit/FeatureTitles', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => (
    <FeatureTitles title="Grow with God" subtitle="Today" />
  ))
  .add('loading', () => <FeatureTitles isLoading />);
