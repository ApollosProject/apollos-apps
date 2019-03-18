import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import {
  TableView,
  ContentCard,
  CardContent,
  ChannelLabel,
  styled,
} from '@apollosproject/ui-kit';

import ActionItem from './ActionItem';

const Header = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(CardContent);

const ContentTable = styled(() => ({
  borderBottomWidth: 0,
  borderTopWidth: 0,
}))(TableView);

class ActionTable extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isLoading: PropTypes.bool,
    content: PropTypes.array, // eslint-disable-line
    label: PropTypes.string,

    dynamicHeader: PropTypes.element,
  };

  render() {
    const { onPress, isLoading, content, label, dynamicHeader } = this.props;
    if (isLoading) {
      return <Text>Hi</Text>; // TODO: Updated loading state
    }

    return (
      <ContentCard
        isLoading={isLoading}
        header={
          <Header>
            <ChannelLabel label={label} />
            {dynamicHeader}
          </Header>
        }
        content={
          <ContentTable>
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
          </ContentTable>
        }
      />
    );
  }
}

export default ActionTable;
