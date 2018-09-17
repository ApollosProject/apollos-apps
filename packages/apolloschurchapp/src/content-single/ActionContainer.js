import React from 'react';

import PropTypes from 'prop-types';

import Share from 'apolloschurchapp/src/ui/Share';

import SideBySideView from 'apolloschurchapp/src/ui/SideBySideView';

import Heart from './Heart';

const ActionContainer = ({ content, itemId }) => (
  <SideBySideView>
    <Heart itemId={itemId} />
    <Share content={content} />
  </SideBySideView>
);

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
};

export default ActionContainer;
