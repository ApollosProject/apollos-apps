import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import BackgroundView from '.';

storiesOf('ui-kit/BackgroundView', module)
  .add('Default', () => <BackgroundView />)
  .add('With custom colors', () => (
    <BackgroundView colors={['#FF0000', '#0000FF']} />
  ))
  .add('With solid color', () => (
    <BackgroundView colors={['#fa8072', '#fa8072']} />
  ))
  .add('With extra props', () => <BackgroundView locations={[0, 0.6]} />);
