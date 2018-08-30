import React from 'react';

import { BottomTabBar } from 'react-navigation-tabs';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const mediaPlayerIsVisible = gql`
  query {
    mediaPlayer @client {
      isVisible
    }
  }
`;
const TabBar = (props) => (
  <Query query={mediaPlayerIsVisible}>
    {({ data = {} }) => {
      const overrideProps = {};
      if (data.mediaPlayer && data.mediaPlayer.isVisible) {
        overrideProps.safeAreaInset = { bottom: 'never', top: 'never' };
      }
      return <BottomTabBar {...props} {...overrideProps} />;
    }}
  </Query>
);

export default TabBar;
