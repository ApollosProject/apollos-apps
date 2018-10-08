import React, { PureComponent } from 'react';
import { ScrollView, View, SafeAreaView } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { LoginButton } from 'apolloschurchapp/src/auth';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import TableView, {
  Cell,
  CellIcon,
  CellText,
  Divider,
} from 'apolloschurchapp/src/ui/TableView';
import { WebBrowserConsumer } from 'apolloschurchapp/src/ui/WebBrowser';
import Touchable from 'apolloschurchapp/src/ui/Touchable';
import { withTheme } from 'apolloschurchapp/src/ui/theme';
import { H1, H5 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import Icon from 'apolloschurchapp/src/ui/Icon';

import LikedContentFeed from './LikedContentFeed';
import UserAvatarHeader from './UserAvatarHeader';
import getLoginState from './getLoginState';
import getUserProfile from './getUserProfile';
import getLikedContent from './getLikedContent';

const Title = styled(({ theme }) => ({ color: theme.colors.primary }))(H1);

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 2.25,
  marginVertical: theme.sizing.baseUnit,
  fill: theme.colors.primary,
}))(Icon);

const Header = styled(({ theme }) => ({
  paddingHorizontal: theme.sizing.baseUnit,
  paddingTop: theme.sizing.baseUnit * 0.75,
  paddingBottom: theme.sizing.baseUnit * 1.5,
  backgroundColor: theme.colors.background.paper,
}))(View);


const ConnectText = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit,
}))(H5);
const StyledLoginButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit,
}))(LoginButton);

class Connect extends PureComponent {
  static navigationOptions = () => ({
    title: 'Connect',
    header: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <BackgroundView>
        <WebBrowserConsumer>
          {(openUrl) => (
            <BackgroundView>
              <ScrollView>
                <Query query={getLoginState}>
                  {({ data }) => {
                    if (get(data, 'isLoggedIn', false))
                      return (
                        <View>
                          <Query
                            query={getUserProfile}
                            fetchPolicy="cache-and-network"
                          >
                            {({
                              data: {
                                currentUser: {
                                  profile: {
                                    photo,
                                    firstName,
                                    lastName,
                                    location,
                                  } = {},
                                } = {},
                              } = {},
                              refetch,
                            }) => (
                              <UserAvatarHeader
                                firstName={firstName}
                                lastName={lastName}
                                location={location}
                                photo={photo}
                                refetch={refetch}
                                navigation={this.props.navigation}
                                disabled
                              />
                            )}
                          </Query>
                          <Query
                            query={getLikedContent}
                            fetchPolicy="cache-and-network"
                          >
                            {({
                              loading,
                              data: { getAllLikedContent = [] } = {},
                            }) => {
                              if (!getAllLikedContent.length) return null;
                              return (
                                <LikedContentFeed
                                  id={'liked'}
                                  name={'Recently Like'}
                                  content={getAllLikedContent}
                                  isLoading={loading}
                                  loadingStateObject={{
                                    title: 'Recently Like',
                                    isLoading: true,
                                  }}
                                />
                              );
                            }}
                          </Query>
                        </View>
                      );
                    return (
                      <SafeAreaView>
                        <Header>
                          <BrandIcon />
                          <Title>Connect!</Title>
                          <H5>
                            Our mission is to help you connect to others as well
                            as help you in your walk with Christ.
                          </H5>
                          <ConnectText>
                            By joining this community, you will unlock amazing
                            features like; curated content and devotionals,
                            simple event registration, and easy online giving!
                          </ConnectText>
                          <LoginButton />
                          <StyledLoginButton />
                        </Header>
                      </SafeAreaView>
                    );
                  }}
                </Query>
                <TableView>
                  <Touchable
                    onPress={() =>
                      openUrl('https://apollosrock.newspring.cc/page/235')
                    }
                  >
                    <Cell>
                      <CellIcon name="check" />
                      <CellText>Find a serving opportunity</CellText>
                    </Cell>
                  </Touchable>
                  <Divider />
                  <Touchable
                    onPress={() =>
                      openUrl('https://apollosrock.newspring.cc/page/236')
                    }
                  >
                    <Cell>
                      <CellIcon name="groups" />
                      <CellText>Join a small group</CellText>
                    </Cell>
                  </Touchable>
                  <Divider />
                  <Touchable
                    onPress={() =>
                      openUrl('https://apollosrock.newspring.cc/page/233')
                    }
                  >
                    <Cell>
                      <CellIcon name="share" />
                      <CellText>I need prayer</CellText>
                    </Cell>
                  </Touchable>
                  <Divider />
                  <Touchable
                    onPress={() =>
                      openUrl('https://apollosrock.newspring.cc/page/186')
                    }
                  >
                    <Cell>
                      <CellIcon name="download" />
                      <CellText>I would like to give</CellText>
                    </Cell>
                  </Touchable>
                </TableView>
              </ScrollView>
            </BackgroundView>
          )}
        </WebBrowserConsumer>
      </BackgroundView>
    );
  }
}

export default Connect;
