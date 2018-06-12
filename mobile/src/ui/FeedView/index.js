import React from 'react';
import { Query } from 'react-apollo';
import GET_USER_FEED from './FeedViewQuery';
import FeedViewWithoutData from './FeedView';

const FeedView = () => (
  <Query query={GET_USER_FEED}>
    {({ loading, error, data }) => {
      if (loading) return null;
      if (error) return `Error!: ${error}`;

      return <FeedViewWithoutData content={data} />;
    }}
  </Query>
);

export default FeedView;
