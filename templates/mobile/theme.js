import ApollosConfig from '@apollosproject/config';
import FRAGMENTS from '@apollosproject/ui-fragments';

const THEME = {
  colors: {},
  typography: {},
  overrides: {},
};

const TABS = {
  Home: {
    showProfile: true,
    showLogo: true,
    showSearch: true,
    headerHideShadow: true,
    headerLargeTitle: false,
  },
  Read: {
    showProfile: true,
    showTags: true,
  },
  Watch: {
    showProfile: true,
  },
  Pray: {
    showProfile: true,
  },
  Connect: {
    showProfile: true,
  },
};

ApollosConfig.loadJs({ FRAGMENTS, THEME, TABS });
