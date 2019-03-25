import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  TableView,
  Card,
  CardContent,
  H6,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';

import ActionItem from './ActionItem';

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
  marginTop: theme.sizing.baseUnit / 1.5,
}))(H6);

const Header = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(CardContent);

const ContentTable = styled(() => ({
  borderBottomWidth: 0,
  borderTopWidth: 0,
}))(TableView);

const ActionTitle = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit / 2,
}))(View);

class ActionTable extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isLoading: PropTypes.bool, // eslint-disable-line
    content: PropTypes.array, // eslint-disable-line
    label: PropTypes.string,
    DynamicHeader: PropTypes.element,
  };

  render() {
    const { onPress, isLoading, content, label, DynamicHeader } = this.props;

    return (
      <Card>
        <Header>
          <StyledH6 isLoading={isLoading}>{label}</StyledH6>
          <ActionTitle>{DynamicHeader}</ActionTitle>
        </Header>
        <ContentTable>
          {content.map((item) => (
            <ActionItem
              isLoading={isLoading}
              key={item.id}
              id={item.id}
              onPress={onPress}
              label={item.parentChannel ? item.parentChannel.name : ''}
              title={item.title || ''}
              imageSource={item.coverImage ? item.coverImage.sources : ''}
            />
          ))}
        </ContentTable>
      </Card>
    );
  }
}

export default withIsLoading(ActionTable);
