import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { H3, H4 } from '../typography';
import styled from '../styled';

const Container = styled({}, 'ui-kit.FeatureTitles.Container')(View);

const FeatureTitles = ({ title, subtitle, isLoading }) => (
  <Container>
    {subtitle ? (
      <H4 secondary isLoading={isLoading && !subtitle}>
        {subtitle}
      </H4>
    ) : null}
    {title ? (
      <H3 primary isLoading={isLoading && !title}>
        {title}
      </H3>
    ) : null}
  </Container>
);

FeatureTitles.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default FeatureTitles;
