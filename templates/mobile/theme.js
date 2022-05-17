import ApollosConfig from '@apollosproject/config';
import Svg, { Path } from 'react-native-svg';
import FRAGMENTS from '@apollosproject/ui-fragments';
import { makeIcon } from '@apollosproject/ui-kit';

const THEME = {
  colors: {},
  typography: {},
  overrides: {},
};

const ICONS = {
  BrandIcon: makeIcon(({ size = 32, fill } = {}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M8.84799129,0 L13.7577354,0 L22.6057267,24 L0,24 L8.84799129,0 Z M6.52559608,19.4398694 L16.0921502,19.4398694 L11.4494502,5.83629831 L11.1682961,5.83629831 L6.52559608,19.4398694 Z"
        fill={fill}
      />
    </Svg>
  )),
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

ApollosConfig.loadJs({ FRAGMENTS, THEME, ICONS, TABS });
