import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';

import { BackgroundView, named } from '@apollosproject/ui-kit';

import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import RockAuthedWebBrowser from '../RockAuthedWebBrowser';
import FeaturesFeedConnected from '../FeaturesFeedConnected';

import ContentFeed from '../ContentFeedConnected';
import TagFilterConnected from '../TagFilterConnected';

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
  options,
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
      <TabStack.Screen
        name={tabName}
        component={TabComponentToRender}
        options={options}
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

const FeatureFeedTabConnected = ({
  tab,
  campusId,
  navigation,
  useTagFilter,
  feedViewProps,
  additionalFeatures,
}) => {
  const [filteredTags, setFilteredTags] = useState([]);
  const { data, loading, error } = useQuery(
    gql`
      query GetTabFeatures($tab: Tab!, $campusId: ID, $tags: [String]) {
        tabFeedFeatures(tab: $tab, campusId: $campusId, tags: $tags) {
          id
        }
      }
    `,
    {
      variables: { tab, campusId, tags: useTagFilter ? filteredTags : [] },
      fetchPolicy: 'cache-and-network',
    }
  );

  if (loading || error) return null;
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
              featureFeedId={data?.tabFeedFeatures?.id}
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

FeatureFeedTabConnected.propTypes = {
  tab: PropTypes.string.isRequired,
  campusId: PropTypes.string,
  useTagFilter: PropTypes.bool,
  feedViewProps: PropTypes.shape({}),
  additionalFeatures: PropTypes.shape({}),
};

FeatureFeedTabConnected.defaultProps = {
  campusId: null,
  useTagFilter: false,
  feedViewProps: {},
  additionalFeatures: {},
};

export default FeatureFeedTabConnected;
