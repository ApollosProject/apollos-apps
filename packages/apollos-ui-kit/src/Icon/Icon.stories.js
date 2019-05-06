import React from 'react';
import { storiesOf } from 'ApollosStorybook/native-storybook';


import { kebabCase } from 'lodash';

import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';

import * as icons from './icons';

import Icon from '.';

const stories = storiesOf('Icon', module).addDecorator((getStory) => (
  <BackgroundView>
    <CenteredView>{getStory()}</CenteredView>
  </BackgroundView>
));

Object.keys(icons).forEach((iconName) => {
  stories.add(iconName, () => <Icon name={kebabCase(iconName)} />);
});

stories.add('isLoading', () => <Icon name={'umbrella'} isLoading />);
