import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';

import { BackgroundView } from '@apollosproject/ui-kit';

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

export const createFeatureFeedTab = ({
  tabName,
  screenOptions,
  feedName,
  tabProps,
}) => {
  const TabStack = createNativeStackNavigator();
  const TabComponent = ({ ...props }) => (
    <FeatureFeedTabConnected tab={feedName} {...props} {...tabProps} />
  );
  const TabNav = () => (
    <TabStack.Navigator
      screenOptions={{
        headerHideShadow: true,
        headerLargeTitle: true,
        ...screenOptions,
      }}
    >
      <TabStack.Screen name={tabName} component={TabComponent} />
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

const FeatureFeedTabConnected = ({ tab, navigation, ...props }) => {
  const { data } = useQuery(
    gql`
      query GetTabFeatures($tab: Tab!) {
        tabFeedFeatures(tab: $tab) {
          id
        }
      }
    `,
    { variables: { tab }, fetchPolicy: 'cache-and-network' }
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
};

export default FeatureFeedTabConnected;
