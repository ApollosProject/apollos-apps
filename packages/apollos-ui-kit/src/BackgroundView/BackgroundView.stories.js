import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import BackgroundView from './index';

storiesOf('ui-kit/BackgroundView', module)
  .add('Screen', () => <BackgroundView />)
  .add('Paper', () => <BackgroundView material="paper" />)
  .add('System', () => <BackgroundView material="system" />);
