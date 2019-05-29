import React from 'react';
import { Query } from 'react-apollo';

import getUserFirstName from './getUserFirstName';
import Features from './Features';

const FeaturesConnected = (props) => (
  <Query query={getUserFirstName}>
    {({
      loading,
      data: {
        currentUser: { profile: { firstName } = { campus: {} } } = {},
      } = {},
    }) => (
      <Features
        firstName={firstName}
        isLoading={loading}
        pressPrimaryEventName={'Features Completed'}
        {...props}
      />
    )}
  </Query>
);

export default FeaturesConnected;
