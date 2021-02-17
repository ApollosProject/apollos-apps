import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import styled from '../styled';
import { ImageSourceType } from '../ConnectedImage';
import Card, { CardContent } from '../Card';
import { withIsLoading } from '../isLoading';
import Button from '../Button';

import FollowListItem from './FollowListItem';

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

class FollowList extends PureComponent {
  static propTypes = {
    followers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        image: ImageSourceType,
      })
    ),
    followListButtonTitle: PropTypes.string,
    isCard: PropTypes.bool,
    header: PropTypes.element,
    isLoading: PropTypes.bool,
    onPressFollowListButton: PropTypes.func,
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
      onPressFollowListButton,
      followListButtonTitle,
      followers,
      header,
    } = this.props;

    const { RenderAsCard } = this;

    return (
      <RenderAsCard>
        {header || null}
        <Content cardPadding={this.props.isCard}>
          {followers.map((item) => (
            <FollowListItem
              {...get(item, 'relatedNode', {})}
              key={item.id}
              name={
                [item.firstName, item.lastName]
                  .filter((name) => Boolean(name))
                  .join(' ') || ''
              }
              imageSource={get(item, 'image.sources[0]', '')}
            />
          ))}
          {onPressFollowListButton && followListButtonTitle ? (
            <FullWidthButton
              title={followListButtonTitle}
              type={'default'}
              pill={false}
              bordered
              onPress={onPressFollowListButton}
            />
          ) : null}
        </Content>
      </RenderAsCard>
    );
  }
}

export default withIsLoading(FollowList);
