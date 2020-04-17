import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import styled from '../styled';
import TableView from '../TableView';
import { ImageSourceType } from '../ConnectedImage';
import Card, { CardContent } from '../Card';
import { withIsLoading } from '../isLoading';
import Button from '../Button';

import ActionListItem from './ActionListItem';

const Content = styled(() => ({
  borderBottomWidth: 0,
  borderTopWidth: 0,
}))(TableView);

const CardAction = styled(
  {
    paddingTop: 0,
  },
  'ui-kit.ActionList.CardAction'
)(CardContent);

class ActionList extends PureComponent {
  static propTypes = {
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        subtitle: PropTypes.string,
        image: ImageSourceType,
      })
    ),
    isCard: PropTypes.bool,
    header: PropTypes.element,
    isLoading: PropTypes.bool,
    onPressActionItem: PropTypes.func,
    onPressActionListButton: PropTypes.func,
  };

  static defaultProps = {
    isCard: true,
  };

  RenderAsCard = ({ children }) =>
    this.props.isCard ? (
      <Card isLoading={this.props.isLoading}>{children}</Card>
    ) : (
      <>{children}</>
    );

  render() {
    const {
      onPressActionListButton,
      onPressActionItem,
      actions,
      header: headerContent,
    } = this.props;

    const RenderAsCard = this.RenderAsCard;

    return (
      <RenderAsCard>
        <CardContent>{headerContent}</CardContent>
        <Content>
          {actions.map((item) => (
            <ActionListItem
              action={item.action || ''}
              key={item.id}
              relatedNode={get(item, 'relatedNode')}
              onPressActionItem={onPressActionItem}
              label={item.subtitle || ''}
              title={item.title || ''}
              imageSource={get(item, 'image.sources[0]', '')}
            />
          ))}
        </Content>
        {onPressActionListButton ? (
          <CardAction>
            <Button
              title={'View More'}
              type={'default'}
              pill={false}
              bordered
              onPress={onPressActionListButton}
            />
          </CardAction>
        ) : null}
      </RenderAsCard>
    );
  }
}

export default withIsLoading(ActionList);
