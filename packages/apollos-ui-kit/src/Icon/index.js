import PropTypes from 'prop-types';
import React from 'react';
import { compose, pure } from 'recompose';
import { flow, camelCase, upperFirst, kebabCase } from 'lodash';

import Placeholder from '../Placeholder';

import * as Icons from './icons';

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

const enhance = compose(pure);

const Icon = enhance(({ name, size, isLoading = false, ...otherProps }) => {
  const IconComponent = Icons[pascalCase(name)];
  return (
    <Placeholder.Media size={size} hasRadius onReady={!isLoading}>
      <IconComponent size={size} {...otherProps} />
    </Placeholder.Media>
  );
});

Icon.propTypes = {
  name: PropTypes.oneOf(Object.keys(Icons).map(kebabCase)).isRequired,
  size: PropTypes.number,
  fill: PropTypes.string,
  isLoading: PropTypes.bool,
};

Icon.defaultProps = {
  size: 32, // 32 is the default size used within the svg component
};

export default Icon;
