import React, { PureComponent, Children } from 'react';
import { useColorScheme } from 'react-native';
import PropTypes from 'prop-types';

import createTheme, { THEME_PROPS } from './createTheme';

export class ThemeProvider extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    themeInput: PropTypes.shape(THEME_PROPS),
    iconInput: PropTypes.objectOf(PropTypes.func),
  };

  static childContextTypes = {
    theme: PropTypes.shape(THEME_PROPS),
    themeInput: PropTypes.shape(THEME_PROPS),
    iconInput: PropTypes.objectOf(PropTypes.func),
  };

  static defaultProps = {
    children: null,
    themeInput: {},
    iconInput: {},
  };

  getChildContext = () => ({
    theme: createTheme(this.props.themeInput),
    themeInput: this.props.themeInput,
    iconInput: this.props.iconInput,
  });

  render() {
    return Children.only(this.props.children);
  }
}

export const ThemeProviderWithApperance = ( { themeInput= {} , ...props} ) => {
  const themeType = useColorScheme();
  return (
    <ThemeProvider {...props}
      themeInput={ { type: themeType, ...themeInput } }
    />
  )
}

export default ThemeProviderWithApperance