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
  Component: PropTypes.node, // Custom component to be rendered. Defaults to Features
};

FeaturesConnected.defaultProps = {
  Component: Features,
};

export default FeaturesConnected;
