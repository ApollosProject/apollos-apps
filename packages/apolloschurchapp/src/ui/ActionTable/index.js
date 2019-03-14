import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import {
  TableView,
  ContentCard,
  CardContent,
  ChannelLabel,
  H3,
  styled,
} from '@apollosproject/ui-kit';

import ActionItem from './ActionItem';

const Header = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(CardContent);

class ActionTable extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isLoading: PropTypes.bool,
    content: PropTypes.array, // eslint-disable-line
    label: PropTypes.string,
    title: PropTypes.string,
  };

  render() {
    const { onPress, isLoading, content, label, title } = this.props;
    if (isLoading) {
      return <Text>Hi</Text>;
    }
    return (
      <ContentCard
        isLoading={isLoading}
        header={
          <Header>
            <ChannelLabel label={label} />
            <H3 numberOfLines={3} ellipsizeMode="tail">
              {title}
            </H3>
          </Header>
        }
        content={
          <TableView>
            {content.map((item) => (
              <ActionItem
                key={item.id}
                id={item.id}
                onPress={onPress}
                label={item.parentChannel ? item.parentChannel.name : ''}
                title={item.title || ''}
                imageSource={item.coverImage ? item.coverImage.sources : ''}
              />
            ))}
          </TableView>
        }
      />
    );
  }
}

export default ActionTable;
