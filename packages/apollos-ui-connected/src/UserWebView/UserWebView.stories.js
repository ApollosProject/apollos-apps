import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import UserWebView from '.';

storiesOf('ui-connected/UserWebView', module).add('Example', () => (
  <UserWebView
    navigation={{ getParam: (uri, fallback) => fallback }}
    url={
      'https://www.whatismybrowser.com/detect/what-http-headers-is-my-browser-sending'
    }
  />
));
