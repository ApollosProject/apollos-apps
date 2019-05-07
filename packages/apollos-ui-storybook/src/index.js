import React from 'react';
import { getStorybookUI, addDecorator } from '@storybook/react-native';

import { loadStories as loadAnalyticsStories } from '@apollosproject/ui-analytics/loadStories';
import { loadStories as loadAuthStories } from '@apollosproject/ui-auth/loadStories';
import { loadStories as loadHTMLViewStories } from '@apollosproject/ui-htmlview/loadStories';
import { loadStories as loadUiKitStories } from '@apollosproject/ui-kit/loadStories';
import { loadStories as loadPassesStories } from '@apollosproject/ui-passes/loadStories';

import './rn-addons';

import { Providers as UIKitProviders } from '@apollosproject/ui-kit';

export * from '@storybook/react-native';

export const addApollosProviderDecorator = (Providers = UIKitProviders) =>
  addDecorator((renderStorybook) => <Providers>{renderStorybook()}</Providers>);

// import stories
export const loadApollosStories = () => {
  require('./stories'); // local stories
  loadAnalyticsStories();
  loadAuthStories();
  loadHTMLViewStories();
  loadUiKitStories();
  loadPassesStories();
};

// Refer to https://github.com/storybooks/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

export default StorybookUIRoot;
