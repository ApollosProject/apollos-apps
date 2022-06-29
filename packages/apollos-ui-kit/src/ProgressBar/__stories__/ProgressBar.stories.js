import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { ScrollView, View } from 'react-native';
import { H3 } from '../../typography';
import PaddedView from '../../PaddedView';
import { ThemeMixin } from '../../theme';

import ProgressBar from '../index';

storiesOf('ui-kit/ProgressBar', module).add('Examples', () => (
  <ScrollView>
    <PaddedView>
      <H3>Progress</H3>
      <ProgressBar step={0} />
      <PaddedView />
      <ProgressBar step={25} />
      <PaddedView />
      <ProgressBar step={50} />
      <PaddedView />
      <ProgressBar step={75} />
      <PaddedView />
      <ProgressBar step={100} />
    </PaddedView>

    <PaddedView>
      <H3>Custom Width</H3>
      <View style={{ width: 200 }}>
        <ProgressBar step={50} />
      </View>
    </PaddedView>

    <PaddedView>
      <H3>Theme Overrides</H3>
      <ThemeMixin mixin={{ colors: { text: { action: 'blue' } } }}>
        <ProgressBar step={50} />
      </ThemeMixin>
    </PaddedView>

    <PaddedView>
      <H3>Negative Input</H3>
      <ProgressBar step={-50} />
    </PaddedView>

    <PaddedView>
      <H3>Input Over 100</H3>
      <ProgressBar step={500} />
    </PaddedView>
  </ScrollView>
));
