import React from 'react';
import PropTypes from 'prop-types';

import { HorizontalDefaultCard } from '@apollosproject/ui-kit';

const horizontalContentCardComponentMapper = ({
  title,
  hyphenatedTitle,
  ...props
}) => {
  // map typename to the the card we want to render.
  return <HorizontalDefaultCard title={title} {...props} />;
};

horizontalContentCardComponentMapper.propTypes = {
  hyphenatedTitle: PropTypes.string,
  title: PropTypes.string,
};

export default horizontalContentCardComponentMapper;
