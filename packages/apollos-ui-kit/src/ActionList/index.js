import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import styled from '../styled';
import { ImageSourceType } from '../ConnectedImage';
import Card, { CardContent } from '../Card';
import { withIsLoading } from '../isLoading';
import Button from '../Button';

import ActionListItem from './ActionListItem';

const Content = styled(
  ({ theme, cardPadding }) => ({
    paddingHorizontal: cardPadding
      ? theme.sizing.baseUnit * 1.5
      : theme.sizing.baseUnit,
    paddingVertical: cardPadding
      ? theme.sizing.baseUnit * 1.5
      : theme.sizing.baseUnit,
  }),
  'ui-kit.ActionList.Content'
)(CardContent);

const FullWidthButton = styled(
  ({ theme }) => ({
    width: '100%', // fixes loading state not showing up at 100% width
    marginTop: theme.sizing.baseUnit * 0.5,
  }),
  'ui-kit.ActionList.FullWidthButton'
)(Button);

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
    actionListButtonTitle: PropTypes.string,
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
      children
    );

  render() {
    const {
      onPressActionItem,
      onPressActionListButton,
      actionListButtonTitle,
      actions,
      header,
    } = this.props;

    const { RenderAsCard } = this;

    return (
      <RenderAsCard>
        {header || null}
        <Content cardPadding={this.props.isCard}>
          {actions.map((item) => (
            <ActionListItem
              {...get(item, 'relatedNode', {})}
              action={item.action || ''}
              key={item.id}
              label={item.subtitle || ''}
              title={item.title || ''}
              imageSource={get(item, 'image.sources[0]', '')}
              {...(onPressActionItem // fixes bug where items appear touchable even when there is no handler
                ? {
                    onPress: () =>
                      onPressActionItem({
                        action: item.action,
                        relatedNode: item.relatedNode,
                      }),
                  }
                : {})}
            />
          ))}
          {onPressActionListButton && actionListButtonTitle ? (
            <FullWidthButton
              title={actionListButtonTitle}
              type={'default'}
              pill={false}
              bordered
              onPress={onPressActionListButton}
            />
          ) : null}
        </Content>
      </RenderAsCard>
    );
  }
}

export default withIsLoading(ActionList);
