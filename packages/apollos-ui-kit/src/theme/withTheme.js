import PropTypes from 'prop-types';
import { compose, mapProps, getContext, hoistStatics } from 'recompose';
import { get } from 'lodash';

import { THEME_PROPS } from './createTheme';

const DEFAULT_MAPPER_FN = ({ theme } = {}) => ({ theme });

export default function(mapperFn = DEFAULT_MAPPER_FN, fqn) {
  return hoistStatics(
    compose(
      getContext({
        theme: PropTypes.shape(THEME_PROPS),
      }),
      mapProps(({ theme, ...otherProps }) => {
        const themeOverridesValue = fqn
          ? get(theme, `overrides['${fqn}']`, {})
          : {};

        const themeOverrides =
          typeof themeOverridesValue === 'function'
            ? themeOverridesValue(otherProps)
            : themeOverridesValue;

        return {
          ...otherProps,
          ...mapperFn({ theme, ...otherProps }),
          ...themeOverrides,
        };
      })
    )
  );
}
