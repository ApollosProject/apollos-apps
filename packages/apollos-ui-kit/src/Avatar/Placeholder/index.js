import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import styled from '../../styled';
import Icon from '../../Icon';
import { withTheme } from '../../theme';

const PlaceholderContainer = styled(
  ({ backgroundColor, themeSize, theme: { colors } }) => ({
    backgroundColor: backgroundColor || colors.background.system,
    width: themeSize,
    height: themeSize,
    borderRadius: themeSize,
    alignItems: 'center',
    justifyContent: 'center',
  })
)(View);

const PlaceholderIcon = withTheme(
  ({ theme: { colors } = {}, themeSize }) => ({
    fill: colors.text.tertiary,
    name: 'user',
    size: themeSize / 2,
  }),
  'ui-kit.Avatar.Avatar.PlaceholderIcon'
)(Icon);

const PlaceholderInitials = styled(({ themeSize, theme }) => ({
  fontSize: themeSize / 2,
  color: theme.colors.background.screen,
  fontFamily: theme.typography.sans.bold.default,
}))(Text);

const initialsToColor = (initials, s = 40, l = 60) => {
  if (!initials) {
    return null;
  }

  let hash = 0;
  initials.split('').forEach((char) => {
    // eslint-disable-next-line no-bitwise
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });

  const h = hash % 360;
  return Color(`hsl(${h}, ${s}%, ${l}%)`).toString();
};

const Placeholder = ({ themeSize, placeholderInitials }) => {
  return (
    <PlaceholderContainer
      themeSize={themeSize}
      backgroundColor={initialsToColor(placeholderInitials)}
    >
      {placeholderInitials && placeholderInitials.length ? (
        <PlaceholderInitials themeSize={themeSize}>
          {placeholderInitials.toUpperCase()}
        </PlaceholderInitials>
      ) : (
        <PlaceholderIcon themeSize={themeSize} />
      )}
    </PlaceholderContainer>
  );
};

Placeholder.propTypes = {
  themeSize: PropTypes.number.isRequired,
  placeholderInitials: PropTypes.string,
};

export default Placeholder;
