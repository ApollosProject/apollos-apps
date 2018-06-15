import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import PaddedView from 'ui/PaddedView';

class ContentSingle extends React.Component {
  static navigationOptions = {
    title: 'Hello',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }),
  };

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item', []);
    console.log('item.item.node.title = ', item.item.node.title);
    return (
      <PaddedView>
        <Text>{item.item.node.title}</Text>
      </PaddedView>
    );
  }
}

export default ContentSingle;
