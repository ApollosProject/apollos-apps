import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  TableView,
  ContentCard,
  CardContent,
  H6,
  styled,
  withIsLoading,
} from '@apollosproject/ui-kit';

import ActionItem from './ActionItem';

const StyledH6 = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
}))(H6);

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
    isLoading: PropTypes.bool, // eslint-disable-line
    content: PropTypes.array, // eslint-disable-line
    label: PropTypes.string,
    DynamicHeader: PropTypes.element,
  };

  render() {
    const { onPress, content, label, DynamicHeader } = this.props;

    return (
      <ContentCard
        header={
          <Header isLoading>
            <StyledH6>{label}</StyledH6>
            {DynamicHeader}
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
                isLoading
              />
            ))}
          </ContentTable>
        }
      />
    );
  }
}

export default withIsLoading(ActionTable);
