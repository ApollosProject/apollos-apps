import React from 'react';
import { Query } from 'react-apollo';

import { withOnPressAnalytics } from '../../utils';
import getUserFirstName from './getUserFirstName';
import Features from './Features';

const FeaturesWithAnalytics = withOnPressAnalytics(Features);

const FeaturesConnected = (props) => (
  <Query query={getUserFirstName}>
    {({
      loading,
      data: {
        currentUser: { profile: { firstName } = { campus: {} } } = {},
      } = {},
    }) => (
      <FeaturesWithAnalytics
        firstName={firstName}
        isLoading={loading}
        {...props}
      />
    )}
  </Query>
);

export default FeaturesConnected;
