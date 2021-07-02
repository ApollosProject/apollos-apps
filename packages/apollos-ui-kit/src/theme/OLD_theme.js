import React from 'react';
import PropTypes from 'prop-types';
import mergeStyles from '../styled/mergeStyles';
import Themer, { useTheme } from './Themer';

export const ThemeProvider = ({ themeInput, iconInput, ...props }) => {
  return <Themer theme={themeInput} icons={iconInput} {...props} />;
};

ThemeProvider.propTypes = {
  themeInput: PropTypes.shape({}),
  iconInput: PropTypes.shape({}),
};

export const withTheme = (
  mapper = ({ theme } = {}) => ({ theme }),
  name = ''
) => (Component) => (props) => {
  const theme = useTheme();
  const themeProps = mapper({ theme, ...props });
  const override = theme?.overrides[name] || {};
  const overrideProps =
    typeof override === 'function' ? override(props) : override;
  const styleProps =
    themeProps.style && overrideProps.style
      ? {
          style: mergeStyles(themeProps.style || {}, overrideProps.style || {}),
        }
      : {};

  return (
    <Component {...props} {...themeProps} {...overrideProps} {...styleProps} />
  );
};

/* eslint-disable-next-line */
export const withThemeMixin = (input) => (Component) => (props) => {
  const theme = useTheme();
  const newTheme =
    typeof input === 'function' ? input({ ...props, theme }) : input;
  return (
    <Themer theme={newTheme}>
      <Component {...props} />
    </Themer>
  );
};

export const ThemeMixin = withThemeMixin(({ mixin = {} } = {}) => mixin)(
  ({ children }) => children
);

export const ThemeConsumer = withTheme()(({ children, theme }) =>
  children(theme)
);
