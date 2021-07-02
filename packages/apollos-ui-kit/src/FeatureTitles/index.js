import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { H3, H4 } from '../typography';
import styled from '../styled';

const Container = named('ui-kit.FeatureTitles.Container')(View);

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
