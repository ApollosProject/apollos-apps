import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ImageSourceType } from '../ConnectedImage';
import TableView from '../TableView';
import Card, { CardContent } from '../Card';
import styled from '../styled';
import { withIsLoading } from '../isLoading';

import ActionListItem from './ActionListItem';

const Content = styled(() => ({
  borderBottomWidth: 0,
  borderTopWidth: 0,
}))(TableView);

class ActionListCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    isLoading: PropTypes.bool,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        image: ImageSourceType,
      })
    ),
    header: PropTypes.element,
  };

  // TODO: move this logic out to the `ConnectedComponent` level
  handleOnPressActionItem = ({ action, relatedNode: { id } }) => {
    const { onPress } = this.props;

    if (action === 'READ_CONTENT') {
      onPress({ id });
    }
  };

  render() {
    const { isLoading, content, header: headerContent } = this.props;

    return (
      <Card isLoading={isLoading}>
        <CardContent>{headerContent}</CardContent>
        <Content>
          {content.map((item) => (
            <ActionListItem
              key={item.id}
              id={item.id}
              onPressActionItem={() => this.handleOnPressActionItem(item)}
              label={item.subtitle || ''}
              title={item.title || ''}
              imageSource={get(item, 'image.sources', '')}
            />
          ))}
        </Content>
      </Card>
    );
  }
}

export default withIsLoading(ActionListCard);
