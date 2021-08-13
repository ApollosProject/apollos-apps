import AsyncStorage from '@react-native-community/async-storage';
import { gql } from '@apollo/client';
import ONBOARDING_VERSION from './Onboarding/version';

export const WITH_USER_ID = gql`
  query currentUserId {
    currentUser {
      id
    }
  }
`;

const makeOnboardingKey = ({ userId }) => `@onboarding-status/${userId}`;

export const onboardingComplete = async ({
  userId,
  version,
  notify = () => null,
}) => {
  try {
    const jsonValue = JSON.stringify(version);
    const key = makeOnboardingKey({ userId });
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    notify(e);
  }
};

export const safeGetOnboardingStatus = async ({
  userId,
  notify = () => null,
}) => {
  try {
    const key = makeOnboardingKey({ userId });
    const jsonValue = await AsyncStorage.getItem(key);
    return JSON.parse(jsonValue);
  } catch (e) {
    notify(e);
  }
  return null;
};

export const checkOnboardingStatusAndNavigate = async ({
  client,
  navigation,
  navigateHome = true, // should we navigate home if we have already onboarded
  notify,
}) => {
  const { data } = await client.query({ query: WITH_USER_ID });
  let onboardingVersion;
  if (data.currentUser.id) {
    onboardingVersion = await safeGetOnboardingStatus({
      userId: data.currentUser.id,
      notify,
    });
    if (!onboardingVersion) {
      onboardingVersion = 0; // if we haven't onboarded before, default us to 0
    } else if (
      onboardingVersion === true ||
      typeof onboardingVersion !== 'number'
    ) {
      onboardingVersion = 1; // if we have onboarded before, we've seen version 0
    }
  }

  // If the user has onboarded before, and they have seen the current version of onboarding.
  if (onboardingVersion && onboardingVersion >= ONBOARDING_VERSION) {
    if (navigateHome) {
      navigation.dispatch(
        navigation.resetAction({
          navigatorName: 'Tabs',
          routeName: 'Home',
        })
      );
    }
  } else {
    navigation.navigate('Onboarding', { userVersion: onboardingVersion });
  }
};
