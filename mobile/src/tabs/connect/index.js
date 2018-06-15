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
            <CellIcon name="group" />
            <CellText> Find a small group!</CellText>
          </Cell>
          <Divider />
          <Cell>
            <CellIcon name="baptism" />
            <CellText> Sign up baptism!</CellText>
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
