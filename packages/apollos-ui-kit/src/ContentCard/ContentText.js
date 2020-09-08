import React from 'react';
import PropTypes from 'prop-types';
import { CardContent } from '../Card';
import { H3, H4, H6, BodyText } from '../typography';
import styled from '../styled';

const StyledCardContent = styled(
  ({ theme, tile }) => ({
    ...(tile ? { paddingTop: theme.sizing.baseUnit } : {}),
    paddingTop: theme.sizing.baseUnit * (tile ? 1 : 1.5), // TODO: should this be vertical ryhthm??? maybe should be applied to `TitleText` ??
    paddingBottom: theme.sizing.baseUnit * 0.75, // this is reduced b/c this is always rendered above the stats section, which also has padding
  }),
  'ui-kit.ContentCard.ContentText.StyledCardContent'
)(CardContent);

const ContentText = ({ title, summary, isLoading, tile }) => {
  const TitleText = tile ? H4 : H3;
  const SummaryText = tile ? H6 : BodyText;
  return (
    <StyledCardContent tile={tile}>
      {title || isLoading ? (
        <TitleText
          numberOfLines={tile && summary ? 1 : 3}
          ellipsizeMode="tail"
          isLoading={isLoading}
        >
          {title}
        </TitleText>
      ) : null}
      {summary || isLoading ? (
        <SummaryText
          numberOfLines={tile ? 2 : 3}
          ellipsizeMode="tail"
          isLoading={isLoading}
        >
          {summary}
        </SummaryText>
      ) : null}
    </StyledCardContent>
  );
};

ContentText.propTypes = {
  title: PropTypes.string,
  summary: PropTypes.string,
  coverImage: PropTypes.any, // eslint-disable-line
  isLoading: PropTypes.bool,
  tile: PropTypes.bool,
};

export default ContentText;
