import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import numeral from 'numeral';
import Color from 'color';

import ChannelLabel from '../ChannelLabel';
import styled from '../styled';
import { withTheme } from '../theme';

const Container = styled(
  {
    flexDirection: 'column',
  },
  'ui-kit.ContentCard.Metrics.Container'
)(View);

const formatValue = (value) => numeral(value).format('0[.]0a');

const Metrics = ({
  metrics = [],
  isLoading,
  theme,
  floating,
  ...channelLabelProps
}) => {
  const tint = floating
    ? Color(theme.colors.primary)
        .mix(Color(theme.colors.text.secondary))
        .string()
    : undefined;
  return (
    <Container>
      {isLoading && (!metrics || !metrics.length) ? (
        <ChannelLabel isLoading icon="empty" label="empty" key="loading" />
      ) : (
        metrics.map(({ value, icon }) => (
          <ChannelLabel
            label={formatValue(value)}
            icon={icon}
            key={icon}
            tint={tint}
            {...channelLabelProps}
          />
        ))
      )}
    </Container>
  );
};

Metrics.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  isLoading: PropTypes.bool,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
      text: PropTypes.shape({ secondary: PropTypes.string }),
    }),
  }),
  floating: PropTypes.bool,
};

export default withTheme()(Metrics);
