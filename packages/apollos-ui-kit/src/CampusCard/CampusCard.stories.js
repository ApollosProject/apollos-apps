/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';

import CampusCard from '.';

storiesOf('ui-kit/CampusCard', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView> // eslint-disable-next-line react-native/no-inline-styles
  ))
  .add('default', () => (
    <CampusCard
      title={'Cameron Poe'}
      description={'"Why couldn\'t you just put the Bunny back in the box?"'}
      images={['https://www.placecage.com/c/250/250']}
      category=""
      distance={2037.6461577685534}
    />
  ))
  .add('isLoading', () => (
    <CampusCard
      title={'Stanley Goodspeed'}
      description={
        '"How… In the name of Zeus\'s BUTTHOLE, did you get out of your cell?"'
      }
      images={['https://www.placecage.com/c/250/250']}
      category=""
      distance={2037.6461577685534}
      isLoading
    />
  ));
