import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import HTMLView from '@apollosproject/ui-htmlview';

import GET_MESSAGE from './getMessage';

const MessageConnected = ({ nodeId }) => {
  const { data } = useQuery(GET_MESSAGE, { nodeId });
  return <HTMLView>{data?.node?.htmlContent}</HTMLView>;
};

MessageConnected.propTypes = {
  nodeId: PropTypes.string.isRequired,
};

export default MessageConnected;
