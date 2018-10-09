import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import numeral from 'numeral';
import ChannelLabel from 'apolloschurchapp/src/ui/ChannelLabel';
import styled from 'apolloschurchapp/src/ui/styled';

const Container = styled(({ theme }) => ({
  flexDirection: 'column',
  opacity: theme.alpha.low,
}))(View);

const formatValue = (value) => numeral(value).format('0[.]0a');

const Metrics = ({ metrics = [], isLoading }) => (
  <Container>
    {isLoading && (!metrics || !metrics.length) ? (
      <ChannelLabel isLoading icon="empty" label="empty" key="loading" />
    ) : (
      metrics.map(({ value, icon }) => (
        <ChannelLabel label={formatValue(value)} icon={icon} key={icon} />
      ))
    )}
  </Container>
);

Metrics.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  isLoading: PropTypes.bool,
};

export default Metrics;
