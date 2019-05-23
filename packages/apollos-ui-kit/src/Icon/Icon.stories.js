import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

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
