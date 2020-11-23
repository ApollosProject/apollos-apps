import React from 'react';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import ActionListFeature from './ActionListFeature';
import GET_ACTION_LIST_FEATURE from './getActionListFeature';

function ActionListFeatureConnected({
  featureId,
  Component,
  isLoading,
  refetchRef,
  ...props
}) {
  return (
    <Query
      query={GET_ACTION_LIST_FEATURE}
      variables={{ featureId }}
      fetchPolicy="cache-and-network"
    >
      {({ data, loading, refetch }) => {
        if (featureId && refetch && refetchRef)
          refetchRef({ refetch, id: featureId });
        return (
          <Component
            {...get(data, 'node')}
            {...props}
            isLoading={loading || isLoading}
          />
        );
      }}
    </Query>
  );
}

ActionListFeatureConnected.propTypes = {
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  refetchRef: PropTypes.func,
};

ActionListFeatureConnected.defaultProps = {
  Component: ActionListFeature,
};

export default ActionListFeatureConnected;
