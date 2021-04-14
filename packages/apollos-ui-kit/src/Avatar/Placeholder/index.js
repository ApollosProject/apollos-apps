import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import styled from '../../styled';

const PlaceholderContainer = styled(({ themeSize, theme: { colors } }) => ({
  backgroundColor: colors.background.inactive,
  width: themeSize,
  height: themeSize,
  borderRadius: themeSize,
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const PlaceholderInitials = styled(({ themeSize, theme }) => ({
  fontSize: themeSize / 2,
  color: theme.colors.background.screen,
  fontFamily: theme.typography.sans.bold.default,
}))(Text);

const Placeholder = ({ themeSize, placeholderInitials }) => {
  return (
    <PlaceholderContainer themeSize={themeSize}>
      <PlaceholderInitials themeSize={themeSize}>
        {placeholderInitials.toUpperCase()}
      </PlaceholderInitials>
    </PlaceholderContainer>
  );
};

Placeholder.propTypes = {
  themeSize: PropTypes.number.isRequired,
  placeholderInitials: PropTypes.string,
};

export default Placeholder;
