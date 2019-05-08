import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { linkTo } from '@storybook/addon-links';

import App from 'apolloschurchapp/src/App';
import Intro from './Intro';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Intro showApp={linkTo('Welcome', 'to the App')} />
  ))
  .add('to the App', () => <App />);
