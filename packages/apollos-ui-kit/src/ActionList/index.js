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

const CardAction = styled(
  {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  'ui-kit.ActionList.CardAction'
)(CardActions);

// const IsCard = ({ children, isCard, isLoading }) =>
//   isCard ? <Card isLoading={isLoading}>{children}</Card> : <>{children}</>;

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

  IsCard = ({ children }) =>
    this.props.isCard ? (
      <Card isLoading={this.props.isLoading}>{children}</Card>
    ) : (
      <>{children}</>
    );

  render() {
    const {
      onPressActionListButton,
      onPressActionItem,
      isLoading,
      actions,
      header: headerContent,
    } = this.props;

    return (
      <this.IsCard>
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
      </this.IsCard>
    );
  }
}

export default withIsLoading(ActionList);
