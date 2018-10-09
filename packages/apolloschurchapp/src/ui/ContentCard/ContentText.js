import React from 'react';
import PropTypes from 'prop-types';
import { CardContent } from 'apolloschurchapp/src/ui/Card';
import { H3, H4, H6, BodyText } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';

const StyledCardContent = styled(({ theme, tile }) => ({
  ...(tile ? { paddingTop: theme.sizing.baseUnit } : {}),
  paddingBottom: theme.sizing.baseUnit * 0.75, // this is reduced b/c this is always rendered above the stats section, which also has padding
}))(CardContent);

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
