import PropTypes from 'prop-types';
import React from 'react';
import { compose, pure, getContext } from 'recompose';
import { flow, camelCase, upperFirst, kebabCase } from 'lodash';

import { getIsLoading } from '../isLoading';
import Placeholder from '../Placeholder';

import * as uikitIcons from '../theme/icons';

const pascalCase = (string) =>
  flow(
    camelCase,
    upperFirst
  )(string);

// Convenience component to render icons based on the icon's string name, like:
// <Icon name="skip-next" {...allOtherPropsPassedToComponent} />
//
// Can also import the icon directly:
// import { SkipNext } from '../theme/icons';
// <SkipNext />

const enhance = compose(
  pure,
  getIsLoading,
  getContext({
    iconInput: PropTypes.objectOf(PropTypes.func),
  })
);

const Icon = ({ name, size, iconInput, isLoading = false, ...otherProps }) => {
  const Icons = { ...uikitIcons, ...iconInput };
  const IconComponent = Icons[pascalCase(name)];
  return (
    <Placeholder.Media size={size} hasRadius onReady={!isLoading}>
      <IconComponent size={size} {...otherProps} />
    </Placeholder.Media>
  );
};
// eslint-disable-next-line consistent-return
export const namePropValidator = (props, propName, componentName) => {
  const icons = Object.keys({ ...uikitIcons, ...props.iconInput }).map(
    kebabCase
  );

  if (!icons.includes(props.name)) {
    // eslint-disable-next-line no-console
    return new Error(
      `Invalid prop \`${propName}\` of value \`${
        props.name
      }\` supplied to \`${componentName}\` expected one of ${JSON.stringify(
        icons
      )}`
    );
  }
};

// PropType checking needs to occur after the `isLoading`` and `iconInput` have been loaded in.
// Those props are added via the call to `enhance`
Icon.propTypes = {
  iconInput: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.object])
  ),
  name: namePropValidator,
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
