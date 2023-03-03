import React from 'react';
import PropTypes from 'prop-types';

import { View, StyleSheet } from 'react-native';
import { named, useTheme } from '../theme';
import { ImageSourceType } from '../ConnectedImage';
import Card, { CardContent } from '../Card';
import { withIsLoading } from '../isLoading';
import Button from '../Button';

import FollowListItem from './FollowListItem';

const HeaderView = named('ui-kit.FollowList.Header')(View);

const Content = named('ui-kit.FollowList.Content')(CardContent);

const FullWidthButton = named('ui-kit.FollowList.FullWidthButton')(Button);

function FollowList(props) {
  const {
    onPressFollowListButton,
    onFollow,
    onHide,
    onConfirm,
    followListButtonTitle,
    followers,
    header,
    isLoading,
    isCard,
  } = props;

  const RenderAsCard = ({ children }) =>
    isCard ? <Card isLoading={isLoading}>{children}</Card> : children;

  const showButton = onPressFollowListButton && followListButtonTitle;
  const theme = useTheme();

  if (followers?.length === 0 && !isLoading && !showButton) {
    return null;
  }

  return (
    <RenderAsCard>
      <Content style={styles.headerView(theme, isCard)}>
        <HeaderView style={styles.headerView(theme)}>
          {header || null}
        </HeaderView>
        {followers.map((person) => {
          const isFollowingState = person?.currentUserFollowing?.state;
          const isFollowed = person?.followingCurrentUser?.state;
          return (
            <FollowListItem
              key={person.id}
              id={person.id}
              requestingFollow={isFollowingState === 'REQUESTED'}
              followRequested={isFollowed === 'REQUESTED'}
              confirmedFollowing={isFollowingState === 'ACCEPTED'}
              confirmedFollower={isFollowed === 'ACCEPTED'}
              name={
                [person.firstName, person.lastName]
                  .filter((name) => Boolean(name))
                  .join(' ') || ''
              }
              profile={person}
              onFollow={() => onFollow?.({ personId: person.id })}
              onHide={() =>
                onHide?.({
                  personId: person.id,
                  requestId: person?.followingCurrentUser?.id,
                })
              }
              onConfirm={() =>
                onConfirm?.({
                  personId: person.id,
                  requestId: person?.followingCurrentUser?.id,
                })
              }
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
            style={styles.fullWidthButton(theme)}
          />
        ) : null}
      </Content>
    </RenderAsCard>
  );
}

FollowList.propTypes = {
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

FollowList.defaultProps = {
  followers: [],
};

const styles = StyleSheet.create({
  headerView: (theme) => ({
    marginBottom: theme.sizing.baseUnit,
  }),
  content: (theme, cardPadding) => ({
    paddingHorizontal: cardPadding
      ? theme.sizing.baseUnit * 1.5
      : theme.sizing.baseUnit,
    paddingVertical: cardPadding
      ? theme.sizing.baseUnit * 1.5
      : theme.sizing.baseUnit,
  }),
  fullWidthButton: (theme) => ({
    width: '100%', // fixes loading state not showing up at 100% width
    marginTop: theme.sizing.baseUnit * 0.5,
  }),
});

export { FollowListItem };
export default withIsLoading(FollowList);
