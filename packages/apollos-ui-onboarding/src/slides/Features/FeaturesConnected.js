import React from 'react';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'prop-types';

import GET_USER_FIRST_NAME from './getUserFirstName';
import Features from './Features';

const FeaturesConnected = ({ Component, ...props }) => (
  <Query query={GET_USER_FIRST_NAME}>
    {({
      loading,
      data: {
        currentUser: { profile: { firstName } = { campus: {} } } = {},
      } = {},
    }) => (
      <Component
        firstName={firstName}
        isLoading={loading}
        pressPrimaryEventName={'Features Completed'}
        {...props}
      />
    )}
  </Query>
);

FeaturesConnected.propTypes = {
  // Custom component to be rendered. Defaults to Features
  Component: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object,
  ]),
};

FeaturesConnected.defaultProps = {
  Component: Features,
};

FeaturesConnected.displayName = 'FeaturesConnected';

export default FeaturesConnected;
