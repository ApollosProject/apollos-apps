import React from 'react';
import { storiesOf } from '@storybook/react-native';

import ErrorCard from './';

storiesOf('Card', module).add('Example', () => (
  <ErrorCard message={'Boom!'} error={'What?'} />
));
