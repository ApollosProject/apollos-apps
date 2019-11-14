/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CampusCard from '.';

storiesOf('ui-kit/CampusCard', module)
  .add('default', () => (
    <CampusCard
      title="FAKE_TITLE"
      description="FAKE_DESCRIPTION"
      images="https://www.placecage.com/c/250/250"
      category=""
      distance={2037.6461577685534}
    />
  ))
  .add('isLoading', () => (
    <CampusCard
      title="FAKE_TITLE"
      description="FAKE_DESCRIPTION"
      images="https://www.placecage.com/c/250/250"
      category=""
      distance={2037.6461577685534}
      isLoading
    />
  ));
