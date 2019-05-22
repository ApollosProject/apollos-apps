import PropTypes from 'prop-types';
import React from 'react';
import { compose, pure, getContext } from 'recompose';
import { flow, camelCase, upperFirst, kebabCase, merge } from 'lodash';

import Placeholder from '../Placeholder';

import * as uikitIcons from './icons';

const pascalCase = (string) =>
  flow(
    camelCase,
    upperFirst
  )(string);

// Convenience component to render icons based on the icon's string name, like:
// <Icon name="skip-next" {...allOtherPropsPassedToComponent} />
//
// Can also import the icon directly:
// import { SkipNext } from 'Icon/icons';
// <SkipNext />

const enhance = compose(
  pure,
  getContext({
    iconInput: PropTypes.objectOf(PropTypes.func),
  })
);

const Icon = enhance(
  ({ name, size, iconInput, isLoading = false, ...otherProps }) => {
    const Icons = merge(iconInput, uikitIcons);
    const IconComponent = Icons[pascalCase(name)];
    return (
      <Placeholder.Media size={size} hasRadius onReady={!isLoading}>
        <IconComponent size={size} {...otherProps} />
      </Placeholder.Media>
    );
  }
);

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(uikitIcons).map(kebabCase)).isRequired,
  size: PropTypes.number,
  fill: PropTypes.string,
  isLoading: PropTypes.bool,
};

Icon.defaultProps = {
  size: 32, // 32 is the default size used within the svg component
};

export default Icon;
