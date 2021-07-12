import React from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import ActionTableFeature from './ActionTableFeature';
import GET_ACTION_TABLE_FEATURE from './getActionTableFeature';

const ActionTableFeatureConnected = ({ featureId, refetchRef, ...props }) => (
  <Query
    query={GET_ACTION_TABLE_FEATURE}
    variables={{ featureId }}
    fetchPolicy="cache-and-network"
  >
    {({ data, refetch }) => {
      if (featureId && refetch && refetchRef)
        refetchRef({ refetch, id: featureId });
      const node = data?.node || {};
      return (
        <ActionTableFeature {...props} {...node} actions={node.actions || []} />
      );
    }}
  </Query>
);

ActionTableFeatureConnected.propTypes = {
  refetchRef: PropTypes.func,
  featureId: PropTypes.string,
};

export default ActionTableFeatureConnected;
