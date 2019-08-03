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

const Icon = enhance(
  ({ name, size, iconInput, isLoading = false, ...otherProps }) => {
    const Icons = { ...uikitIcons, ...iconInput };
    const IconComponent = Icons[pascalCase(name)];

    return (
      <Placeholder.Media size={size} hasRadius onReady={!isLoading}>
        <IconComponent size={size} {...otherProps} />
      </Placeholder.Media>
    );
  }
);

// eslint-disable-next-line consistent-return
const namePropValidator = (props, propName, componentName) => {
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

Icon.propTypes = {
  name: namePropValidator,
  size: PropTypes.number,
  fill: PropTypes.string,
  isLoading: PropTypes.bool,
};

Icon.defaultProps = {
  size: 32, // 32 is the default size used within the svg component
};

Icon.displayName = 'Icon';

export default Icon;
