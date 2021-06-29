import PropTypes from 'prop-types';
import React from 'react';
import { compose, pure } from 'recompose';
import { flow, camelCase, upperFirst, kebabCase } from 'lodash';

import { getIsLoading } from '../isLoading';
import Placeholder from '../Placeholder';

import { useIcons, useTheme } from '../theme';

const pascalCase = (string) => flow(camelCase, upperFirst)(string);

// Convenience component to render icons based on the icon's string name, like:
// <Icon name="skip-next" {...allOtherPropsPassedToComponent} />
//
// Can also import the icon directly:
// import { SkipNext } from '../theme/icons';
// <SkipNext />

const enhance = compose(pure, getIsLoading);

const Icon = ({ name, size, fill, isLoading = false, ...otherProps }) => {
  const theme = useTheme();
  const Icons = useIcons();
  const kebabNames = Object.keys(Icons).map(kebabCase);
  if (!kebabNames.includes(name))
    console.warn(
      `Invalid prop "name" of value \`${name}\` supplied to <Icon />, expected one of ${JSON.stringify(
        kebabNames
      )}`
    );
  const IconComponent = Icons[pascalCase(name)];
  return (
    <Placeholder.Media size={size} hasRadius onReady={!isLoading}>
      <IconComponent
        size={size}
        fill={fill || theme.colors.text.primary}
        {...otherProps}
      />
    </Placeholder.Media>
  );
};

// PropType checking needs to occur after the `isLoading`` and `iconInput` have been loaded in.
// Those props are added via the call to `enhance`
Icon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.number,
  fill: PropTypes.string,
  isLoading: PropTypes.bool,
};

Icon.defaultProps = {
  size: 32, // 32 is the default size used within the svg component
};

const IconWithIconInputAndLoading = enhance(Icon);

IconWithIconInputAndLoading.displayName = 'Icon';

export default IconWithIconInputAndLoading;
