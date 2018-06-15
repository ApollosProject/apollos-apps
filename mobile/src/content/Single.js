import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import ImageHeader from 'ui/ImageHeader';
import PaddedView from 'ui/PaddedView';

class ContentSingle extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const item = navigation.getParam('item', []);
    const itemTitle = item.item.node.parentChannel.name;
    return {
      title: itemTitle || 'Content Channel Title Here',
    };
  };

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }),
  };

  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item', []);
    console.log(
      'item.item.node.coverImage.sources[0].uri = ',
      item.item.node.coverImage.sources[0].uri
    );
    // isLoading={isLoading}
    // overlayColor={backgroundColor}
    return (
      <View>
        <ImageHeader images={item.item.node.coverImage.sources} />
        <PaddedView>
          <Text>{item.item.node.title}</Text>
        </PaddedView>
      </View>
    );
  }
}

export default ContentSingle;
