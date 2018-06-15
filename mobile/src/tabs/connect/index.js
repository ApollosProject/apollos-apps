import React from 'react';
/* import { StyleSheet, View } from 'react-native'; */
import { createStackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import FlexedView from 'ui/FlexedView';
import TableView, { Cell, CellIcon, CellText, Divider } from 'ui/TableView';
import LiveNowButton from '../../live';

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); */

export class ConnectScreen extends React.Component {
  static navigationOptions = {
    title: 'Connect',
  };
  render() {
    return (
      <FlexedView>
        <LiveNowButton navigation={this.props.navigation} />
        <TableView>
          <Cell>
            <CellIcon name="check" />
            <CellText> Find a serving opportunity</CellText>
          </Cell>
          <Divider />
          <Cell>
            <CellIcon name="groups" />
            <CellText> Join a small group</CellText>
          </Cell>
          <Divider />
          <Cell>
            <CellIcon name="share" />
            <CellText> I need prayer</CellText>
          </Cell>
          <Divider />
          <Cell>
            <CellIcon name="download" />
            <CellText> I would like to give</CellText>
          </Cell>
          <Divider />
          <Cell>
            <CellIcon name="building" />
            <CellText> Find Service Times & Locations</CellText>
          </Cell>
        </TableView>
      </FlexedView>
    );
  }
}

ConnectScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export const ConnectStack = createStackNavigator(
  {
    Connect: ConnectScreen,
  },
  {
    initialRouteName: 'Connect',
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default ConnectStack;
