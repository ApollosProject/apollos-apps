import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { View } from 'react-native';
import styled from '../styled';
import { ImageSourceType } from '../ConnectedImage';
import Card, { CardContent } from '../Card';
import { withIsLoading } from '../isLoading';
import Button from '../Button';

import FollowListItem from './FollowListItem';
import FollowListSearch from './FollowListSearch';
import FollowListSearchModal from './FollowListSearch/FollowListSearchModal';

const HeaderView = styled(
  ({ theme }) => ({
    marginBottom: theme.sizing.baseUnit,
  }),
  'ui-kit.FollowList.Header'
)(View);

const Content = styled(
  ({ theme, cardPadding }) => ({
    paddingHorizontal: cardPadding
      ? theme.sizing.baseUnit * 1.5
      : theme.sizing.baseUnit,
    paddingVertical: cardPadding
      ? theme.sizing.baseUnit * 1.5
      : theme.sizing.baseUnit,
  }),
  'ui-kit.FollowList.Content'
)(CardContent);

const FullWidthButton = styled(
  ({ theme }) => ({
    width: '100%', // fixes loading state not showing up at 100% width
    marginTop: theme.sizing.baseUnit * 0.5,
  }),
  'ui-kit.FollowList.FullWidthButton'
)(Button);

class FollowList extends PureComponent {
  static propTypes = {
    followers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        image: ImageSourceType,
        request: PropTypes.bool,
        requested: PropTypes.bool,
        confirmed: PropTypes.bool,
      })
    ),
    followListButtonTitle: PropTypes.string,
    isCard: PropTypes.bool,
    header: PropTypes.element,
    isLoading: PropTypes.bool,
    onPressFollowListButton: PropTypes.func,
    onFollow: PropTypes.func,
    onHide: PropTypes.func,
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    followers: [],
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
      onFollow,
      onHide,
      onConfirm,
      followListButtonTitle,
      followers,
      header,
      isLoading,
    } = this.props;

    const { RenderAsCard } = this;

    const showButton = onPressFollowListButton && followListButtonTitle;

    if (followers?.length === 0 && !isLoading && !showButton) return null;

    return (
      <RenderAsCard>
        <Content cardPadding={this.props.isCard}>
          <HeaderView>{header || null}</HeaderView>
          {followers.map((item) => {
            const isFollowingState = item?.currentUserFollowing?.state;
            const isFollowed = item?.followingCurrentUser?.state;
            return (
              <FollowListItem
                key={item.id}
                id={item.id}
                requestingFollow={isFollowingState === 'REQUESTED'}
                followRequested={isFollowed === 'REQUESTED'}
                confirmedFollowing={isFollowingState === 'ACCEPTED'}
                confirmedFollower={isFollowed === 'ACCEPTED'}
                name={
                  [item.firstName, item.lastName]
                    .filter((name) => Boolean(name))
                    .join(' ') || ''
                }
                imageSource={item.photo}
                onFollow={() => onFollow?.(item.id)}
                onHide={() => onHide?.(item.id)}
                onConfirm={() => onConfirm?.(item.id)}
              />
            );
          })}
          {showButton ? (
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

export { FollowListItem, FollowListSearch, FollowListSearchModal };
export default withIsLoading(FollowList);
