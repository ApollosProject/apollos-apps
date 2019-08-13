import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import styled from '../styled';
import TableView from '../TableView';
import { ImageSourceType } from '../ConnectedImage';
import Card, { CardContent, CardActions } from '../Card';
import { withIsLoading } from '../isLoading';
import Button from '../Button';

import ActionListItem from './ActionListItem';

const Content = styled(() => ({
  borderBottomWidth: 0,
  borderTopWidth: 0,
}))(TableView);

const CardActionButton = styled(
  {
    width: '100%',
  },
  'ui-kit.ActionListCard.CardActionButton'
)(Button);

class ActionListCard extends PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    onPressActionItem: PropTypes.func,
    isLoading: PropTypes.bool,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        image: ImageSourceType,
      })
    ),
    header: PropTypes.element,
  };

  render() {
    const { isLoading, actions, header: headerContent } = this.props;

    return (
      <Card isLoading={isLoading}>
        <CardContent>{headerContent}</CardContent>
        <Content>
          {actions.map((item) => (
            <ActionListItem
              action={item.action || ''}
              key={item.id}
              relatedNodeId={get(item, 'relatedNode.id', '')}
              onPressActionItem={this.props.onPressActionItem}
              label={item.subtitle || ''}
              title={item.title || ''}
              imageSource={get(item, 'image.sources', '')}
            />
          ))}
        </Content>
        <CardActions>
          <CardActionButton
            title={'View More'}
            type={'default'}
            pill={false}
            bordered
          />
        </CardActions>
      </Card>
    );
  }
}

export default withIsLoading(ActionListCard);
