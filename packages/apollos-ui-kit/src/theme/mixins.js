import {
  getContext,
  compose,
  mapProps,
  withContext,
  withPropsOnChange,
} from 'recompose';
import PropTypes from 'prop-types';
import { merge } from 'lodash';

import createTheme, { THEME_PROPS } from './createTheme';

function stripNullLeaves(obj, cb) {
  const out = {};

  Object.keys(obj).forEach((k) => {
    let val;

    if (obj[k] !== null && typeof obj[k] === 'object') {
      out[k] = stripNullLeaves(obj[k], cb);
    } else if (val != null) {
      out[k] = val;
    }
  });

  return out;
}

const withThemeMixin = (themeInput) =>
  compose(
    mapProps((props) => ({ ownProps: props })),
    getContext({
      theme: PropTypes.shape(THEME_PROPS),
      themeInput: PropTypes.shape(THEME_PROPS),
    }),
    withPropsOnChange(
      (props, nextProps) =>
        props.theme !== nextProps.theme ||
        props.themeInput !== nextProps.themeInput,
      ({ theme, themeInput: originalThemeInput, ownProps }) => {
        let themeInputAsObject = themeInput;
        if (typeof themeInput === 'function') {
          themeInputAsObject = themeInput({ ...ownProps, theme });
        }

        themeInputAsObject = stripNullLeaves(
          merge({}, originalThemeInput, themeInputAsObject)
        );

        const themeWithMixin = createTheme(themeInputAsObject);

        return {
          theme: themeWithMixin,
          themeInput: themeInputAsObject,
        };
      }
    ),
    withContext(
      {
        theme: PropTypes.shape(THEME_PROPS),
        themeInput: PropTypes.shape(THEME_PROPS),
      },
      ({ theme, themeInput: newThemeInput }) => ({
        theme,
        themeInput: newThemeInput,
      })
    ),
    mapProps(({ ownProps }) => ownProps)
  );

const ThemeMixin = withThemeMixin(({ mixin = {} } = {}) => mixin)(
  ({ children }) => children
);

export { withThemeMixin, ThemeMixin };
