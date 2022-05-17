import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigation, useRoute } from '@react-navigation/native';

import { BackgroundView } from '@apollosproject/ui-kit';

import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import RockAuthedWebBrowser from '../RockAuthedWebBrowser';
import FeaturesFeedConnected from '../FeaturesFeedConnected';

import ContentFeed from '../ContentFeedConnected';
import TagFilterConnected from '../TagFilterConnected';

const Tab = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [filteredTags, setFilteredTags] = useState([]);
  return (
    <>
      {route.params.showTags ? (
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
            />
          </BackgroundView>
        )}
      </RockAuthedWebBrowser>
    </>
  );
};

export const createTab = ({ featureFeedId, title, options, showTags }) => {
  const TabStack = createNativeStackNavigator();
  const TabNav = () => (
    <TabStack.Navigator
      screenOptions={{
        headerHideShadow: true,
        headerLargeTitle: true,
      }}
    >
      <TabStack.Screen
        name={title}
        component={Tab}
        options={options}
        initialParams={{ featureFeedId, showTags }}
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
