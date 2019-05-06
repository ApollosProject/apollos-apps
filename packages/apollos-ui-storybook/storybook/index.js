import React from 'react';
import { AppRegistry } from 'react-native';
import {
  getStorybookUI,
  configure,
  addDecorator,
} from 'ApollosStorybook/native-storybook';

import { loadStories as loadAnalyticsStories } from '@apollosproject/ui-analytics/loadStories';
import { loadStories as loadAuthStories } from '@apollosproject/ui-auth/loadStories';

import { loadStories as loadHTMLViewStories } from '@apollosproject/ui-htmlview/loadStories';

import { loadStories as loadUiKitStories } from '@apollosproject/ui-kit/loadStories';

import { loadStories as loadPassesStories } from '@apollosproject/ui-passes/loadStories';

import { loadStories as loadApolloschurchappStories } from 'apolloschurchapp/loadStories';

import './rn-addons';

import Providers from 'apolloschurchapp/src/Providers';

addDecorator(renderStorybook => <Providers>{renderStorybook()}</Providers>);

// import stories
configure(() => {
  require('./stories'); // local stories
  loadAnalyticsStories();
  loadAuthStories();
  loadHTMLViewStories();
  loadUiKitStories();
  loadPassesStories();
  loadApolloschurchappStories();
}, module);

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent('%APP_NAME%', () => StorybookUIRoot);

export default StorybookUIRoot;
