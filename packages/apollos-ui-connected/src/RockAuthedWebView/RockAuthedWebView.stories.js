import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import RockAuthedWebView from '.';

storiesOf('ui-connected/RockAuthedWebView', module).add('Example', () => (
  <RockAuthedWebView
    navigation={{ getParam: (uri, fallback) => fallback }}
    url={
      'https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending'
    }
  />
));
