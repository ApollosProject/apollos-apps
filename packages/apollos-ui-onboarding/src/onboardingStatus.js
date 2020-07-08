import AsyncStorage from '@react-native-community/async-storage';
import gql from 'graphql-tag';
import { resetAction } from '@apollosproject/ui-kit/src/NavigationService';

export const WITH_USER_ID = gql`
  query currentUserId {
    currentUser {
      id
    }
  }
`;

export const onboardingComplete = async ({ userId }) => {
  try {
    const jsonValue = JSON.stringify(true);
    await AsyncStorage.setItem(`@onboarding-status/${userId}`, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const checkOnboardingStatusAndNavigate = async ({
  client,
  navigation,
}) => {
  console.log('checkOnboardingStatusAndNavigate');
  const { data } = await client.query({ query: WITH_USER_ID });
  console.log({ data });
  let hasOnboarded = false;
  if (data.currentUser.id) {
    console.log('outside try');
    try {
      const jsonValue = await AsyncStorage.getItem(
        `@onboarding-status/${data.currentUser.id}`
      );
      console.log({ jsonValue });
      hasOnboarded = jsonValue != null ? JSON.parse(jsonValue) : false;
      console.log({ hasOnboarded });
    } catch (e) {
      // error reading value
    }
  }
  console.log({ hasOnboarded });

  // at this point, we can that resetAction is not a function
  console.log({ resetAction });
  // 👆 this is undefined, b/c of how resetAction is imported.
  /*
    Two options to fix:

    # First, you could import this way:
        import NavigationService from '@apollosproject/ui-kit/src/NavigationService';
      And then call resetAction below like this:
        NavigationService.resetAction({ ... })

    # Second option:
        Since `navigation` is already a prop on this function, you don't need to import at all again.
        Just reference it below:

        navigation.resetAction({ ... })
  */

  if (hasOnboarded) {
    navigation.dispatch(
      resetAction({
        navigatorName: 'Tabs',
        routeName: 'Home',
      })
    );
  } else {
    navigation.navigate('Onboarding');
  }
};
