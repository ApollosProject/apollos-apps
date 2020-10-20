import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import ActionBarFeature from './ActionBarFeature';
import GET_ACTION_BAR_FEATURE from './getActionBarFeature';

const ActionBarConnected = ({ featureId, refetchRef, ...props }) => (
  <Query
    query={GET_ACTION_BAR_FEATURE}
    variables={{ featureId }}
    fetchPolicy="cache-and-network"
  >
    {({ data, refetch }) => {
      if (featureId && refetch && refetchRef)
        refetchRef({ refetch, id: featureId });
      const node = data?.node || {};
      return (
        <ActionBarFeature {...props} {...node} actions={node.actions || []} />
      );
    }}
  </Query>
);

ActionBarConnected.propTypes = {
  refetchRef: PropTypes.func,
  featureId: PropTypes.string,
};

export default ActionBarConnected;
