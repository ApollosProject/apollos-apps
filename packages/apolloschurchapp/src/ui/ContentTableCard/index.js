import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  TableView,
  Card,
  CardContent,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';

import ContentTableCardItem from './ContentTableCardItem';

const Header = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(CardContent);

const Content = styled(() => ({
  borderBottomWidth: 0,
  borderTopWidth: 0,
}))(TableView);

const Title = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit / 2,
}))(View);

class ContentTableCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isLoading: PropTypes.bool, // eslint-disable-line
    content: PropTypes.array, // eslint-disable-line
    DynamicHeader: PropTypes.element,
  };

  render() {
    const { onPress, isLoading, content, DynamicHeader } = this.props;

    return (
      <Card>
        <Header>
          <Title>{DynamicHeader}</Title>
        </Header>
        <Content>
          {content.map((item) => (
            <ContentTableCardItem
              isLoading={isLoading}
              key={item.id}
              id={item.id}
              onPress={onPress}
              label={item.parentChannel ? item.parentChannel.name : ''}
              title={item.title || ''}
              imageSource={item.coverImage ? item.coverImage.sources : ''}
            />
          ))}
        </Content>
      </Card>
    );
  }
}

export default withIsLoading(ContentTableCard);
