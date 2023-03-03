import { ScrollView } from 'react-native';
import { useQuery, useApolloClient, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { getVersion, getBuildNumber } from 'react-native-device-info';
import { get } from 'lodash';
import Color from 'color';

import {
  BackgroundView,
  TableView,
  Row,
  Divider,
  Touchable,
  NavigationService,
  H3,
  H6,
  PaddedView,
  styled,
} from '@apollosproject/ui-kit';

import {
  UserAvatarUpdate,
  usePersonFollowing,
  usePersonFollowedBy,
  useCurrentUserFollowRequests,
} from '@apollosproject/ui-connected';

import {
  checkOnboardingStatusAndNavigate,
  onboardingComplete,
} from 'onboarding';
import { useLogout } from 'auth';

const Container = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(PaddedView);

const AppVersion = styled(({ theme }) => ({
  color: theme.colors.neutral.gray3,
  textAlign: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(H6);

const NewLabel = styled(({ theme }) => ({
  color: theme.colors.primary,
  backgroundColor: Color(theme.colors.primary).fade(0.8).string(),
  textAlign: 'center',
  paddingVertical: theme.sizing.baseUnit * 0.25,
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
  borderRadius: 8,
  overflow: 'hidden',
}))(H6);

const UserSettings = () => {
  const navigation = useNavigation();
  const logout = useLogout();
  const client = useApolloClient();
  const { data } = useQuery(gql`
    query currentUserId {
      currentUser {
        id
        profile {
          id
          firstName
          lastName
          campus {
            id
            name
          }
        }
      }

      likedContent {
        totalCount
      }
    }
  `);
  const { total: totalFollowing } = usePersonFollowing(
    data?.currentUser?.profile?.id
  );
  const { total: totalFollowers } = usePersonFollowedBy(
    data?.currentUser?.profile?.id
  );
  const { total: totalRequests } = useCurrentUserFollowRequests();

  const firstName = get(data, 'currentUser.profile.firstName');
  const lastName = get(data, 'currentUser.profile.lastName');
  const campusName = get(data, 'currentUser.profile.campus.name');
  const likedCount = get(data, 'likedContent.totalCount');

  //if (loading) {
  //return <ActivityIndicator />;
  //}
  return (
    <BackgroundView avoidHeader>
      <ScrollView>
        <Container>
          <UserAvatarUpdate />
          <H3>{firstName && lastName ? `${firstName} ${lastName}` : ''}</H3>
        </Container>
        <PaddedView />
        <TableView>
          <Touchable
            onPress={() => {
              navigation.navigate('Following', {
                personId: data?.currentUser?.profile?.id,
                screen: 'followed_by',
              });
            }}
          >
            <Row
              title="Following Me"
              leadingIcon="users-three"
              accessoryText={`${totalFollowers}`}
              accessoryComponent={totalRequests > 0 && <NewLabel>New</NewLabel>}
            />
          </Touchable>

          <Touchable
            onPress={() => {
              navigation.navigate('Following', {
                personId: data?.currentUser?.profile?.id,
                screen: 'following',
              });
            }}
          >
            <Row
              title="I'm Following"
              leadingIcon="user-circle"
              accessoryText={`${totalFollowing}`}
            />
          </Touchable>

          <Touchable
            onPress={() => {
              navigation.navigate('LikedContentFeedConnected');
            }}
          >
            <Row
              title="Liked Content"
              leadingIcon="heart"
              accessoryText={`${likedCount || 0}`}
            />
          </Touchable>
        </TableView>

        <PaddedView />

        <TableView headerText="My Profile">
          <Touchable
            onPress={() => {
              navigation.navigate('PersonalDetails');
            }}
          >
            <Row title="Personal Details" leadingIcon="user" />
          </Touchable>

          <Touchable
            onPress={() => {
              navigation.navigate('Location');
            }}
          >
            <Row
              title="My Campus"
              leadingIcon="navigation-arrow"
              accessoryText={campusName || 'Select'}
            />
          </Touchable>
        </TableView>

        <PaddedView />

        <TableView headerText="Settings">
          <Touchable
            onPress={() => {
              navigation.navigate('ChangePassword');
            }}
          >
            <Row title="Change Password" leadingIcon="lock-simple" />
          </Touchable>

          <Touchable
            onPress={() => {
              navigation.navigate('Notifications');
            }}
          >
            <Row title="Notification Settings" leadingIcon="bell" />
          </Touchable>
        </TableView>

        <PaddedView />

        <TableView>
          <Touchable
            onPress={() => {
              logout();
              // This resets the navigation stack, and the navigates to the first auth screen.
              // This ensures that user isn't navigated to a subscreen of Auth, like the pin entry screen.
              NavigationService.resetToAuth();
            }}
          >
            <Row title="Logout" leadingIcon="arrow-square-out" />
          </Touchable>
        </TableView>

        <AppVersion>
          {`App Version: ${getVersion()}.${getBuildNumber()}`}
        </AppVersion>

        {/* testing panel */}
        {process.env.NODE_ENV !== 'production' ? (
          <>
            <PaddedView />
            <TableView headerText="Developer Tools">
              <Touchable
                onPress={() => NavigationService.resetToAuth('OpenIDConnected')}
              >
                <Row title="Launch OpenID Flow" />
              </Touchable>
              <Divider />
              <Touchable
                onPress={() =>
                  checkOnboardingStatusAndNavigate({
                    latestOnboardingVersion: 2,
                    navigation: NavigationService,
                    client,
                  })
                }
              >
                <Row title="Launch Onboarding" />
              </Touchable>
              <Divider />
              <Touchable
                onPress={() =>
                  onboardingComplete({
                    version: 0,
                    userId: data?.currentUser?.id,
                  })
                }
              >
                <Row title="Reset Onboarding to Unseen" />
              </Touchable>
              <Divider />
              <Touchable
                onPress={() =>
                  onboardingComplete({
                    version: 1,
                    userId: data?.currentUser?.id,
                  })
                }
              >
                <Row title="Reset Onboarding to Seen v1" />
              </Touchable>
            </TableView>
            <PaddedView />
          </>
        ) : null}
      </ScrollView>
    </BackgroundView>
  );
};

export default UserSettings;
