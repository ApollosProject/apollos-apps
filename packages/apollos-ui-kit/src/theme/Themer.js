import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import PropTypes from 'prop-types';
import { merge, isPlainObject } from 'lodash';
import * as coreIcons from './icons';
import createTheme from './createTheme';

const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const IconContext = createContext();
const useIcons = () => useContext(IconContext);

// for backward compatibility with class based components
const Theme = ThemeContext.Consumer;

// This function deeply strips out values in an object that are null or undefined.
// In other words, turns { bla: { foo: 'dark', bar: null }, baz: null }
// into { bla: { foo: 'dark' } }
const stripNullLeaves = (obj, cb) => {
  const out = {};

  Object.keys(obj).forEach((k) => {
    const val = obj[k];

    if (val !== null && typeof val === 'object' && isPlainObject(val)) {
      out[k] = stripNullLeaves(val, cb);
    } else if (obj[k] != null) {
      out[k] = val;
    }
  });

  return out;
};

const Themer = ({ theme: customTheme, icons: customIcons, ...props }) => {
  let theme = useTheme();
  const type = useColorScheme();
  if (!theme) theme = createTheme({ type });

  let icons = useIcons();
  if (!icons) icons = coreIcons;

  return (
    <IconContext.Provider value={{ ...icons, ...customIcons }}>
      <ThemeContext.Provider
        // this allows us to overwrite another provider somewhere up the chain.
        // <Themer theme={theme}> can be used at the top level and then
        // further down the tree <Themer theme={theme}> can be called to further
        // customize the the theme
        value={merge({}, theme, stripNullLeaves({ type, ...customTheme }))}
        // prop spreading shouldn't be necessary, currently we are passing through
        // the one signal key on the app template, need to find a way around
        {...props}
      />
    </IconContext.Provider>
  );
};

Themer.propTypes = {
  theme: PropTypes.shape({}),
  icons: PropTypes.shape({}),
};

Themer.defaultProps = {
  theme: {},
  icons: {},
};

// TODO maybe make this a hook?
// usePropOverrides(name) returns the props?
function NamedWithTheme({ name, Component, initialProps }) {
  const theme = useTheme();
  const override = theme?.overrides?.[name] || {};
  const overrideProps =
    typeof override === 'function' ? override(initialProps) : override;
  return <Component {...initialProps} {...overrideProps} />;
}

NamedWithTheme.propTypes = {
  name: PropTypes.string.isRequired,
  Component: PropTypes.shape({}),
  initialProps: PropTypes.shape({}),
};

// eslint-disable-next-line react/display-name
const named = (name) => (Component) => (props) => {
  return (
    <NamedWithTheme name={name} Component={Component} initialProps={props} />
  );
};

export { useTheme, Theme, useIcons, named };
export default Themer;
