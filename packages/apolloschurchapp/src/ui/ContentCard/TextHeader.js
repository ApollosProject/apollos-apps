import React from 'react';
import PropTypes from 'prop-types';
import styled from 'apolloschurchapp/src/ui/styled';
import { CardContent } from 'apolloschurchapp/src/ui/Card';
import { H3 } from 'apolloschurchapp/src/ui/typography';

const Container = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.accent,
}))(CardContent);

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
