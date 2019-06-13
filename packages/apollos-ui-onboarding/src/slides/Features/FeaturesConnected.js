import React from 'react';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';

import getUserFirstName from './getUserFirstName';
import Features from './Features';

const FeaturesConnected = ({ Component, ...props }) => (
  <Query query={getUserFirstName}>
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
