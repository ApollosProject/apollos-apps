import React from 'react';
import PropTypes from 'prop-types';
import styled from '../styled';
import { CardContent } from '../Card';
import { H3 } from '../typography';

const Container = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.background.accent,
  }),
  'ui-kit.ContentCard.TextHeader.Container'
)(CardContent);

const TextHeader = ({ title }) => (
  <Container>
    <H3 numberOfLines={3} ellipsizeMode="tail">
      {title}
    </H3>
  </Container>
);

TextHeader.propTypes = {
  title: PropTypes.string,
};

export default TextHeader;
