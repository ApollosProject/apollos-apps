import React from 'react';
import PropTypes from 'prop-types';

import ContentTitles from '../ContentTitles';

const ContentText = ({ title, summary, isLoading, tile }) => {
  return (
    <ContentTitles
      title={title}
      summary={summary}
      isLoading={isLoading}
      micro={tile}
    />
  );
};

ContentText.propTypes = {
  title: PropTypes.string,
  summary: PropTypes.string,
  isLoading: PropTypes.bool,
  tile: PropTypes.bool,
};

export default ContentText;
