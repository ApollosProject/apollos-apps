import {
  getContext,
  compose,
  mapProps,
  withContext,
  withPropsOnChange,
} from 'recompose';
import PropTypes from 'prop-types';
import { merge, isPlainObject } from 'lodash';

import createTheme, { THEME_PROPS } from './createTheme';

// This function deeply strips out values in an object that are null or undefined.
// In other words, turns { bla: { foo: 'orange', bar: null }, baz: null }
// into { bla: { foo: 'orange' } }
function stripNullLeaves(obj, cb) {
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
}

const withThemeMixin = (themeInput) =>
  compose(
    mapProps((props) => ({ ownProps: props })),
    getContext({
      themeContext: PropTypes.shape(THEME_PROPS),
      themeInput: PropTypes.shape(THEME_PROPS),
    }),
    withPropsOnChange(
      (props, nextProps) =>
        props.themeContext !== nextProps.themeContext ||
        props.themeInput !== nextProps.themeInput ||
        props.ownProps.mixin !== nextProps.ownProps.mixin,
      ({ themeContext, themeInput: originalThemeInput, ownProps }) => {
        // Start with the original theme input
        let themeInputAsObject = themeInput;
        // If it's a function, call the function with the current props + theme.
        if (typeof themeInput === 'function') {
          themeInputAsObject = themeInput({ ...ownProps, theme: themeContext });
        }
        // Now, merge together the input, and strip out all the null leaves.
        // This is important. Null leaves will override default values from the base theme, without providing a replacement.
        // This causes the app to crash if you're not careful to provide values for the entire theme.
        // Very common when sending GQL data over the wire.
        themeInputAsObject = merge(
          {},
          originalThemeInput,
          stripNullLeaves(themeInputAsObject)
        );

        const themeWithMixin = createTheme(themeInputAsObject);

        return {
          themeContext: themeWithMixin,
          themeInput: themeInputAsObject,
        };
      }
    ),
    withContext(
      {
        themeContext: PropTypes.shape(THEME_PROPS),
        themeInput: PropTypes.shape(THEME_PROPS),
      },
      ({ themeContext, themeInput: newThemeInput }) => ({
        themeContext,
        themeInput: newThemeInput,
      })
    ),
    mapProps(({ ownProps }) => ownProps)
  );

const ThemeMixin = withThemeMixin(({ mixin = {} } = {}) => mixin)(
  ({ children }) => children
);

export { withThemeMixin, ThemeMixin };
