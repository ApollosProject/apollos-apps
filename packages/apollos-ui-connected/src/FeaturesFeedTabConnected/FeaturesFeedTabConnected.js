import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';

import { BackgroundView, named } from '@apollosproject/ui-kit';

import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import RockAuthedWebBrowser from '../RockAuthedWebBrowser';
import FeaturesFeedConnected, {
  FEATURE_FEED_ACTION_MAP,
} from '../FeaturesFeedConnected';

import ContentFeed from '../ContentFeedConnected';

function handleOnPress({ action, ...props }) {
  if (FEATURE_FEED_ACTION_MAP[action]) {
    FEATURE_FEED_ACTION_MAP[action]({ action, ...props });
  }
}

export const DefaultTabComponent = named(
  'ui-connected.FeatureFeedTabConnected.DefaultTabComponent'
)(({ feedName, ...props }) => (
  <FeatureFeedTabConnected tab={feedName} {...props} />
));

export const CampusTabComponent = named(
  'ui-connected.FeatureFeedTabConnected.CampusTabComponent'
)(({ feedName, ...props }) => {
  const { data } = useQuery(gql`
    query currentUserCampus {
      currentUser {
        id
        profile {
          id
          campus {
            id
          }
        }
      }
    }
  `);
  return (
    <FeatureFeedTabConnected
      tab={feedName}
      campusId={data?.currentUser?.profile?.campus?.id}
      {...props}
    />
  );
});

export const createFeatureFeedTab = ({
  tabName,
  screenOptions,
  feedName,
  tabProps,
  TabComponent = DefaultTabComponent,
}) => {
  const TabComponentToRender = (props) => (
    <TabComponent {...props} feedName={feedName} {...tabProps} />
  );
  const TabStack = createNativeStackNavigator();
  const TabNav = () => (
    <TabStack.Navigator
      screenOptions={{
        headerHideShadow: true,
        headerLargeTitle: true,
        ...screenOptions,
      }}
    >
      <TabStack.Screen name={tabName} component={TabComponentToRender} />
      <TabStack.Screen
        component={ContentFeed}
        name="ContentFeed"
        options={({ route }) => ({
          title: route?.params?.itemTitle || 'Content Feed',
          stackPresentation: 'push',
        })}
      />
    </TabStack.Navigator>
  );
  return TabNav;
};

const FeatureFeedTabConnected = ({
  tab,
  campusId = null,
  navigation,
  ...props
}) => {
  const { data } = useQuery(
    gql`
      query GetTabFeatures($tab: Tab!, $campusId: ID) {
        tabFeedFeatures(tab: $tab, campusId: $campusId) {
          id
        }
      }
    `,
    { variables: { tab, campusId }, fetchPolicy: 'cache-and-network' }
  );

  return (
    <RockAuthedWebBrowser>
      {(openUrl) => (
        <BackgroundView>
          <FeaturesFeedConnected
            openUrl={openUrl}
            featureFeedId={data?.tabFeedFeatures?.id}
            onPressActionItem={handleOnPress}
            navigation={navigation}
            {...props}
          />
        </BackgroundView>
      )}
    </RockAuthedWebBrowser>
  );
};

FeatureFeedTabConnected.propTypes = {
  tab: PropTypes.string.isRequired,
  campusId: PropTypes.string,
};

export default FeatureFeedTabConnected;
