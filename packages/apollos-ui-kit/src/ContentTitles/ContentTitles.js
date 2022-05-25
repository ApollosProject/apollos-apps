import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import Icon from '../Icon';

import { named, withTheme } from '../theme';
import { H2, H3, H4, BodyText, BodySmall } from '../typography';
import PaddedView from '../PaddedView';
import FlexedView from '../FlexedView';
import styled from '../styled';

import SocialBar from '../SocialBar';

/**
 * ContentTitles
 * Implements https://www.figma.com/file/YHJLj8pdFxWG9npF2YmB3r/UI-Kit-2.0?node-id=15%3A185
 *
 * Status:
 * - [ ] ChannelLabel
 * - [x] Title
 * - [x] Summary
 * - [ ] Social Engagement
 * - [x] Social Bar
 * - [x] Featured
 * - [x] Micro
 * - [x] Themeable
 * - [ ] Loading state
 * */

const ActionLayout = styled(
  () => ({
    flexDirection: 'row',
    alignItems: 'center',
  }),
  'ui-kit.HighlightCard.ActionLayout'
)(View);

const FlexedActionLayout = styled(
  ({ theme }) => ({
    marginRight: theme.sizing.baseUnit * 0.5, // spaces out text from `ActionIcon`. This has to live here for ActionIcon's loading state
    flex: 0,
  }),
  'ui-kit.HighlightCard.FlexedActionLayout'
)(FlexedView);

const ActionIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.text.primary,
    size: theme.sizing.baseUnit * 2,
  }),
  'ui-kit.ContentTitles.ActionIcon'
)(Icon);

const TitleText = styled(
  ({ theme }) => ({ color: theme.colors.text.primary }),
  'ui-kit.ContentTitles.TitleText'
)(Text);

const SummaryText = styled(
  ({ theme }) => ({ color: theme.colors.text.secondary }),
  'ui-kit.ContentTitles.SummaryText'
)(Text);

const Container = styled(
  {
    width: '100%',
    paddingHorizontal: 20,
  },
  'ui-kit.ContentTitles.Container'
)(PaddedView);

const renderWithIcon = (actionIcon, label) =>
  actionIcon ? (
    <ActionLayout>
      <FlexedActionLayout>
        <ActionIcon name={actionIcon} />
      </FlexedActionLayout>
      {label}
    </ActionLayout>
  ) : (
    <>{label}</>
  );

const ContentTitles = ({
  label,
  title,
  summary,
  featured,
  micro,
  isLoading = false,
  isLiked,
  onPressLike,
  onPressShare,
  actionIcon,
}) => {
  if (featured && micro) {
    console.warn(
      'You are using both featured and micro on ContentTitles, which is not supported'
    );
  }

  let Title = H3;
  if (featured) {
    Title = H2;
  }
  if (micro) {
    Title = H4;
  }

  let Summary = BodyText;
  if (micro) {
    Summary = BodySmall;
  }

  let numberOfTitleLines = 3;
  if (summary || micro) {
    numberOfTitleLines = 2;
  }
  if (micro && summary && label) {
    numberOfTitleLines = 1;
  }

  return (
    <Container>
      {actionIcon || label ? renderWithIcon(actionIcon, label) : null}
      {title || isLoading ? (
        <Title
          numberOfLines={numberOfTitleLines}
          isLoading={!title && isLoading}
        >
          <TitleText>{title}</TitleText>
        </Title>
      ) : null}
      {summary || isLoading ? (
        <Summary
          numberOfLines={micro ? 2 : 3}
          isLoading={!summary && isLoading}
        >
          <SummaryText>{summary}</SummaryText>
        </Summary>
      ) : null}

      {!micro ? (
        <SocialBar
          isLiked={isLiked}
          onPressLike={onPressLike}
          onPressShare={onPressShare}
        />
      ) : null}
    </Container>
  );
};

ContentTitles.propTypes = {
  label: PropTypes.element,
  title: PropTypes.string,
  actionIcon: PropTypes.string,
  summary: PropTypes.string,
  featured: PropTypes.bool,
  micro: PropTypes.bool,
  isLiked: PropTypes.bool,
  onPressLike: PropTypes.func,
  onPressShare: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default named('ui-kit.ContentTitles')(ContentTitles);
