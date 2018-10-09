import React from 'react';
import PropTypes from 'prop-types';
import { CardContent } from 'apolloschurchapp/src/ui/Card';
import { H3, BodyText } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';

const StyledCardContent = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.75, // this is reduced b/c this is always rendered above the stats section, which also has padding
}))(CardContent);

const ContentText = ({ title, summary, isLoading }) => (
  <StyledCardContent>
    {title || isLoading ? (
      <H3 numberOfLines={3} ellipsizeMode="tail" isLoading={isLoading}>
        {title}
      </H3>
    ) : null}
    {summary || isLoading ? (
      <BodyText numberOfLines={3} ellipsizeMode="tail" isLoading={isLoading}>
        {summary}
      </BodyText>
    ) : null}
  </StyledCardContent>
);

ContentText.propTypes = {
  title: PropTypes.string,
  summary: PropTypes.string,
  coverImage: PropTypes.any, // eslint-disable-line
  isLoading: PropTypes.bool,
};

export default ContentText;
