import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import {
  TableView,
  Divider,
  ContentCard,
  CardContent,
  H5,
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
    content: PropTypes.array,
  };

  render() {
    const { onPress, isLoading, content } = this.props;
    if (isLoading) {
      return <Text>Hi</Text>;
    }
    return (
      <ContentCard
        isLoading={isLoading}
        header={
          <Header>
            <H5>FOR YOU</H5>
            <H3 numberOfLines={3} ellipsizeMode="tail">
              Some random text that encourages you
            </H3>
          </Header>
        }
        content={
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
        }
      />
    );
  }
}

export default ActionTable;
