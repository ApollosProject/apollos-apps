import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigation, useRoute } from '@react-navigation/native';

import { BackgroundView } from '@apollosproject/ui-kit';

import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import RockAuthedWebBrowser from '../RockAuthedWebBrowser';
import FeaturesFeedConnected from '../FeaturesFeedConnected';

import ContentFeed from '../ContentFeedConnected';
import TagFilterConnected from '../TagFilterConnected';

const Tab = ({ useTagFilter, feedViewProps, additionalFeatures }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [filteredTags, setFilteredTags] = useState([]);
  return (
    <>
      {useTagFilter ? (
        <TagFilterConnected
          filteredTags={filteredTags}
          setFilteredTags={setFilteredTags}
        />
      ) : null}
      <RockAuthedWebBrowser>
        {(openUrl) => (
          <BackgroundView>
            <FeaturesFeedConnected
              openUrl={openUrl}
              featureFeedId={route.params.featureFeedId}
              navigation={navigation}
              feedViewProps={feedViewProps}
              additionalFeatures={additionalFeatures}
            />
          </BackgroundView>
        )}
      </RockAuthedWebBrowser>
    </>
  );
};

Tab.propTypes = {
  useTagFilter: PropTypes.bool,
  feedViewProps: PropTypes.shape({}),
  additionalFeatures: PropTypes.shape({}),
};

Tab.defaultProps = {
  useTagFilter: false,
  feedViewProps: {},
  additionalFeatures: {},
};

export const createTab = ({ featureFeedId, title, screenOptions, options }) => {
  const TabStack = createNativeStackNavigator();
  const TabNav = () => (
    <TabStack.Navigator
      screenOptions={{
        headerHideShadow: true,
        headerLargeTitle: true,
        ...screenOptions,
      }}
    >
      <TabStack.Screen
        name={title}
        component={Tab}
        options={options}
        initialParams={{ featureFeedId }}
      />
      <TabStack.Screen
        component={ContentFeed}
        name="ContentFeed"
        options={({ route }) => ({
          title: route?.params?.itemTitle || 'Content Feed',
        })}
      />
      <TabStack.Screen
        component={FeaturesFeedConnected}
        name="FeatureFeed"
        options={({ route }) => ({
          title: route?.params?.title || 'Feed',
        })}
      />
    </TabStack.Navigator>
  );
  return TabNav;
};

export default createTab;
