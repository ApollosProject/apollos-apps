import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import ErrorCard from '.';

storiesOf('Card/ErrorCard', module).add('Example', () => (
  <ErrorCard message={'Boom!'} error={'What?'} />
));
