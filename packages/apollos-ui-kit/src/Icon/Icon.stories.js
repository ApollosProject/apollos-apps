/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { ScrollView, View, Text } from 'react-native';

import { kebabCase } from 'lodash';

import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';
import * as icons from '../theme/icons';

import Icon from '.';

const stories = storiesOf('ui-kit/Icon', module).addDecorator((getStory) => (
  <BackgroundView>
    <CenteredView>{getStory()}</CenteredView>
  </BackgroundView>
));

Object.keys(icons).forEach((iconName) => {
  stories.add(iconName, () => <Icon name={kebabCase(iconName)} />);
});

stories.add('isLoading', () => <Icon name={'umbrella'} isLoading />);

stories.add('All Icons', () => (
  <ScrollView>
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      {Object.keys(icons).map((iconName) => (
        <View key={iconName} style={{ alignItems: 'center', margin: 8 }}>
          <Icon name={kebabCase(iconName)} />
          <Text>{iconName}</Text>
        </View>
      ))}
    </View>
  </ScrollView>
));
