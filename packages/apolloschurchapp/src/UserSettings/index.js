import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';

import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import TableView, {
  Cell,
  CellIcon,
  CellText,
  Divider,
} from 'apolloschurchapp/src/ui/TableView';
import { WebBrowserConsumer } from 'apolloschurchapp/src/ui/WebBrowser';
import Touchable from 'apolloschurchapp/src/ui/Touchable';
import AvatarForm from 'apolloschurchapp/src/ui/UserAvatarView/AvatarForm';
import styled from 'apolloschurchapp/src/ui/styled';

const AvatarView = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(PaddedView);

class UserSettings extends PureComponent {
  static navigationOptions = () => ({
    title: 'Settings',
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }),
  };

  render() {
    return (
      <BackgroundView>
        <AvatarView>
          <AvatarForm
            disabled={false}
            text
            photo={this.props.navigation.getParam('photo', '')}
            refetch={this.props.navigation.getParam('refetch', {})}
          />
        </AvatarView>
        <WebBrowserConsumer>
          {(openUrl) => (
            <BackgroundView>
              <TableView>
                <Touchable
                  onPress={() =>
                    openUrl('https://apollosrock.newspring.cc/page/236')
                  }
                >
                  <Cell>
                    <CellText>Personal Details</CellText>
                    <CellIcon name="arrow-next" />
                  </Cell>
                </Touchable>
                <Divider />
                <Touchable
                  onPress={() => openUrl('https://apollosrock.newspring.cc/')}
                >
                  <Cell>
                    <CellText>Change Password</CellText>
                    <CellIcon name="arrow-next" />
                  </Cell>
                </Touchable>
                <Divider />
              </TableView>
              <TableView>
                <Touchable
                  onPress={() => openUrl('https://apollosrock.newspring.cc/')}
                >
                  <Cell>
                    <CellText>Give Feedback</CellText>
                    <CellIcon name="arrow-next" />
                  </Cell>
                </Touchable>
              </TableView>
              <TableView>
                <Touchable
                  onPress={() => openUrl('https://apollosrock.newspring.cc/')}
                >
                  <Cell>
                    <CellText>Privacy Policy</CellText>
                    <CellIcon name="arrow-next" />
                  </Cell>
                </Touchable>
                <Divider />
                <Touchable
                  onPress={() => openUrl('https://apollosrock.newspring.cc/')}
                >
                  <Cell>
                    <CellText>Terms of Use</CellText>
                    <CellIcon name="arrow-next" />
                  </Cell>
                </Touchable>
                <Divider />
              </TableView>
              <TableView>
                <Touchable
                  onPress={() => openUrl('https://apollosrock.newspring.cc/')}
                >
                  <Cell>
                    <CellText>Logout</CellText>
                    <CellIcon name="arrow-next" />
                  </Cell>
                </Touchable>
              </TableView>
            </BackgroundView>
          )}
        </WebBrowserConsumer>
      </BackgroundView>
    );
  }
}

export default UserSettings;
