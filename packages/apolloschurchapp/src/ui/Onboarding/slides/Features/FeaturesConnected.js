import React from 'react';
import { Query } from 'react-apollo';

import getUserFirstName from './getUserFirstName';
import Features from '.';

const AskNameConnected = (props) => (
  <Query query={getUserFirstName}>
    {({
      loading,
      data: {
        currentUser: { profile: { firstName } = { campus: {} } } = {},
      } = {},
    }) => <Features firstName={firstName} isLoading={loading} {...props} />}
  </Query>
);

AskNameConnected.displayName = AskNameConnected;

export default AskNameConnected;
