import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ApollosConfig from '@apollosproject/config';
import {
  NavigationService,
  useTheme,
  Icon,
  Touchable,
} from '@apollosproject/ui-kit';
import { useApolloClient } from '@apollo/client';
import { UserAvatarConnected } from '@apollosproject/ui-connected';
import { checkOnboardingStatusAndNavigate } from '@apollosproject/ui-onboarding';
import createTab from './createTab';

const HeaderLogo = () => {
  const theme = useTheme();
  return (
    <Icon
      name="brand-icon"
      size={theme.sizing.baseUnit * 1.5}
      fill={theme.colors.primary}
    />
  );
};

const ProfileButton = () => {
  const navigation = useNavigation();
  return (
    <Touchable
      onPress={() => {
        navigation.navigate('UserSettingsNavigator');
      }}
    >
      <View>
        <UserAvatarConnected size="xsmall" />
      </View>
    </Touchable>
  );
};

const SearchButton = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <Touchable
      onPress={() => {
        navigation.navigate('Search');
      }}
    >
      <View>
        <Icon
          name="search"
          size={theme.sizing.baseUnit * 2}
          fill={theme.colors.primary}
        />
      </View>
    </Touchable>
  );
};

const tabBarIcon = (name) => {
  function TabBarIcon({ color }) {
    return <Icon name={name} fill={color} size={24} />;
  }
  TabBarIcon.propTypes = {
    color: PropTypes.string,
  };
  return TabBarIcon;
};

const { Navigator, Screen } = createBottomTabNavigator();

const Tabs = ({ tabs }) => {
  const client = useApolloClient();
  // this is only used by the tab loaded first
  // if there is a new version of the onboarding flow,
  // we'll navigate there first to show new screens
  useEffect(() => {
    checkOnboardingStatusAndNavigate({
      client,
      navigation: NavigationService,
      navigateHome: false,
    });
  }, [client]);
  const tabNavs = useMemo(
    () =>
      tabs.map(({ title, icon, feed }, i) => ({
        title,
        icon,
        component: createTab({
          featureFeedId: feed.id,
          options: {
            headerLargeTitle: i !== 0,
            ...(ApollosConfig.TABS[title]?.showLogo
              ? { headerCenter: HeaderLogo }
              : {}),
            ...(ApollosConfig.TABS[title]?.showSearch
              ? { headerRight: SearchButton }
              : {}),
            ...(ApollosConfig.TABS[title]?.showProfile
              ? { headerLeft: ProfileButton }
              : {}),
          },
          title,
          showTags: ApollosConfig.TABS[title]?.showTags || false,
        }),
      })),
    [tabs]
  );
  return tabNavs.length ? (
    <Navigator>
      {tabNavs.map(({ title, icon, component }) => (
        <Screen
          key={title}
          name={title}
          component={component}
          options={{ tabBarIcon: tabBarIcon(icon) }}
        />
      ))}
    </Navigator>
  ) : null;
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.string,
      feed: PropTypes.shape({ id: PropTypes.string }),
    })
  ),
};

Tabs.defaultProps = {
  tabs: [],
};

export default Tabs;
