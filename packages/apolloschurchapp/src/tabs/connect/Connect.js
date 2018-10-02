import React, { PureComponent } from 'react';
import { ScrollView, View } from 'react-native';
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
import LikedContentFeed from './LikedContentFeed';
import UserAvatarHeader from './UserAvatarHeader';

import getLoginState from './getLoginState';
import getUserProfile from './getUserProfile';
import getLikedContent from './getLikedContent';

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
                    return null;
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
        <LoginButton />
      </BackgroundView>
    );
  }
}

export default Connect;
