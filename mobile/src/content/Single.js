import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import HTMLView from 'ui/HTMLView';
import ImageHeader from 'ui/ImageHeader';
import PaddedView from 'ui/PaddedView';
import { H3 } from 'ui/typography';

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
    return (
      <ScrollView>
        <ImageHeader images={item.item.node.coverImage.sources} />
        <PaddedView>
          <H3>{item.item.node.title}</H3>
        </PaddedView>
        <PaddedView>
          <HTMLView>{item.item.node.htmlContent}</HTMLView>
        </PaddedView>
      </ScrollView>
    );
  }
}

export default ContentSingle;
