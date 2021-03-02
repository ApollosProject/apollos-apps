import PropTypes from 'prop-types';
import { compose, mapProps, getContext, hoistStatics } from 'recompose';
import { get } from 'lodash';

import mergeStyles from '../styled/mergeStyles';
import { THEME_PROPS } from './createTheme';

const DEFAULT_MAPPER_FN = ({ theme } = {}) => ({ theme });

export default function withTheme(mapperFn = DEFAULT_MAPPER_FN, fqn) {
  return hoistStatics(
    compose(
      getContext({
        themeContext: PropTypes.shape(THEME_PROPS),
      }),
      mapProps(({ themeContext: theme, ...otherProps }) => {
        const themeOverridesValue = fqn
          ? get(theme, `overrides['${fqn}']`, {})
          : {};

        const themeOverrides =
          typeof themeOverridesValue === 'function'
            ? themeOverridesValue(otherProps)
            : themeOverridesValue;

        const withThemeProps = mapperFn({ theme, ...otherProps });

        let mergedOverides = {};
        // We need to deep merge te style props. Other nested props are not currently merged
        if (themeOverrides.style && withThemeProps.style) {
          const mergedStyles = mergeStyles(
            withThemeProps.style,
            themeOverrides.style
          );
          mergedOverides = { style: mergedStyles };
        }

        return {
          ...otherProps,
          ...withThemeProps,
          ...themeOverrides,
          ...mergedOverides,
        };
      })
    )
  );
}

export const named = (name) => withTheme(() => ({}), name);
