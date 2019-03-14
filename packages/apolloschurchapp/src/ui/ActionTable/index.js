import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import {
  TableView,
  Divider,
  // styled,
} from '@apollosproject/ui-kit';
import ActionItem from './ActionItem';

class ActionTable extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isLoading: PropTypes.bool,
    content: PropTypes.array,
  };

  render() {
    const { onPress, isLoading, content } = this.props;
    if (isLoading) {
      return <Text>Hi</Text>;
    }
    return (
      <TableView>
        {content.map((item) => (
          <>
            <ActionItem
              key={item.id}
              onPress={onPress}
              label={item.parentChannel ? item.parentChannel.name : ''}
              title={item.title || ''}
              imageSource={item.coverImage ? item.coverImage.sources : ''}
            />
            <Divider />
          </>
        ))}
      </TableView>
    );
  }
}

export default ActionTable;
