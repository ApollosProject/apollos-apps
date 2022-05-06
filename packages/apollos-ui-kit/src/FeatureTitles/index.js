import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { H3, H4 } from '../typography';
import styled from '../styled/index';

const Container = styled(
  {
    flexShrink: 1,
  },
  'ui-kit.FeatureTitles.Container'
)(View);

/**
 * FeatureTitles
 * Implements https://www.figma.com/file/YHJLj8pdFxWG9npF2YmB3r/UI-Kit-2.0?node-id=27%3A373
 *
 * Status:
 * - [x] Title
 * - [x] Subtitle
 * - [x] Loading state
 *
 * */

const FeatureTitles = ({ title, subtitle, isLoading, style }) => (
  <Container style={style}>
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
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({})]),
};

export default FeatureTitles;
