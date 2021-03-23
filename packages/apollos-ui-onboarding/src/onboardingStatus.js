import AsyncStorage from '@react-native-community/async-storage';
import gql from 'graphql-tag';

export const WITH_USER_ID = gql`
  query currentUserId {
    currentUser {
      id
    }
  }
`;

const makeOnboardingKey = ({ userId }) => `@onboarding-status/${userId}`;

export const onboardingComplete = async ({ userId, version }) => {
  try {
    const jsonValue = JSON.stringify(version);
    const key = makeOnboardingKey({ userId });
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

const safeGetOnboardingStatus = async ({ userId }) => {
  try {
    const key = makeOnboardingKey({ userId });
    const jsonValue = await AsyncStorage.getItem(key);
    return JSON.parse(jsonValue);
  } catch (e) {
    // error reading value
  }
  return null;
};

export const checkOnboardingStatusAndNavigate = async ({
  client,
  navigation,
  latestOnboardingVersion = 1,
}) => {
  const { data } = await client.query({ query: WITH_USER_ID });
  let onboardingVersion;
  if (data.currentUser.id) {
    onboardingVersion = safeGetOnboardingStatus();
    if (onboardingVersion === true) {
      onboardingVersion = 1; // if we have onboarded before, we've seen version 0
    }
  }

  // If the user has onboarded before, and they have seen the current version of onboarding.
  if (onboardingVersion && onboardingVersion >= latestOnboardingVersion) {
    navigation.dispatch(
      navigation.resetAction({
        navigatorName: 'Tabs',
        routeName: 'Home',
      })
    );
  } else {
    navigation.navigate('Onboarding', { userVersion: onboardingVersion });
  }
};

export const hideIfSeen = (Component) => ({
  version = 1,
  userVersion = 0,
  ...props
}) => {
  if (version > userVersion) {
    return <Component {...props} />;
  }
  return null;
};
