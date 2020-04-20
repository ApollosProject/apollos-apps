import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import ActionListFeature from './ActionListFeature';
import GET_ACTION_LIST_FEATURE from './getActionListFeature';

function ActionListFeatureConnected({
  featureId,
  Component,
  isLoading,
  ...props
}) {
  return (
    <Query query={GET_ACTION_LIST_FEATURE} variables={{ featureId }}>
      {({ data, loading }) => (
        <Component
          {...get(data, 'node')}
          {...props}
          isLoading={loading || isLoading}
        />
      )}
    </Query>
  );
}

ActionListFeatureConnected.propTypes = {
  Component: PropTypes.elementType,
  featureId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

ActionListFeatureConnected.defaultProps = {
  Component: ActionListFeature,
};

export default ActionListFeatureConnected;
