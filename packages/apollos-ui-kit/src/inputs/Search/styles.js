import React, { memo } from 'react';
import { View, TextInput, Platform } from 'react-native';

import styled from '../../styled';
import { withTheme } from '../../theme';
import Icon from '../../Icon';
import { ButtonIcon } from '../../Button';
import { UIText } from '../../typography';

const SearchWrapper = styled(
  ({ theme, disabled }) => ({
    overflow: 'hidden',
    ...(disabled ? { opacity: theme.alpha.medium } : {}),
  }),
  'ui-kit.inputs.Search.styles.SearchWrapper'
)(View);

const TextInputWrapper = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    borderRadius: theme.sizing.baseBorderRadius,
    backgroundColor: theme.colors.background.screen,
    overflow: 'hidden',
  }),
  'ui-kit.inputs.Search.styles.TextInputWrapper'
)(View);

// We do some memo gymnastics here so that this icon isn't effected by rerenders caused by input state
const LoopIcon = withTheme(
  ({ theme, isFocused }) => ({
    fill: isFocused
      ? theme.colors.action.secondary
      : theme.colors.text.tertiary,
    size: theme.helpers.rem(1),
    style: {
      marginLeft: theme.sizing.baseUnit,
    },
  }),
  'ui-kit.inputs.Search.styles.LoopIcon'
)(memo((props) => <Icon {...props} />)); // eslint-disable-line react/display-name

const Input = withTheme(
  ({ theme, isFocused, cancelButtonOffset }) => ({
    placeholderTextColor: theme.colors.text.tertiary,
    selectionColor: theme.colors.action.secondary,
    style: {
      color: theme.colors.text.primary, // fixes android text color when switching theme types
      flexGrow: 1, // fixes weird text behind icon (ios) and placeholder clipping (android) bugs
      height: theme.helpers.rem(2.5), // we have to have a height to make this display correctly. using typographic unit to scale with text size.
      paddingVertical: 0, // removes weird "default" padding
      paddingLeft: theme.sizing.baseUnit * 0.5,
      paddingRight: isFocused // we have to dynamically adjust the padding otherwise it causes the placeholder text to disappear
        ? cancelButtonOffset + theme.sizing.baseUnit * 5
        : 0, // `CancelButton` + padding + `ClearSearchButton` + a 🧙‍24px 🤷‍
      fontSize: theme.helpers.rem(0.875),
      fontFamily: theme.typography.ui.regular,
      ...Platform.select({
        // aligns text with icon on ios
        ios: {
          paddingTop: 1,
        },
      }),
    },
  }),
  'ui-kit.inputs.Search.styles.Input'
)(({ forwardedRef, ...props }) => <TextInput ref={forwardedRef} {...props} />);

// the main reason this component lives here is because we need access to theme colors
const SmokeAndMirrorsWrapper = styled(
  ({ theme, screenBackgroundColor }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: screenBackgroundColor || theme.colors.background.paper,
  }),
  'ui-kit.inputs.Search.styles.SmokeAndMirrorsWrapper'
)(View);

const ClearSearchButtonBackground = styled(
  ({ theme }) => ({
    borderTopRightRadius: theme.sizing.baseUnit,
    borderBottomRightRadius: theme.sizing.baseUnit,
    backgroundColor: theme.colors.background.screen,
    ...Platform.select({
      // fixes ios border radius bug
      ios: {
        overflow: 'hidden',
        borderRightWidth: 1,
        borderColor: theme.colors.background.screen,
      },
    }),
  }),
  'ui-kit.inputs.Search.styles.ClearSearchButtonBackground'
)(View);

const ClearSearchButton = withTheme(
  ({ theme, isVisible }) => ({
    fill: theme.colors.text.tertiary,
    size: theme.helpers.rem(1),
    iconPadding: theme.helpers.rem(0.75),
    style: {
      opacity: isVisible ? 1 : 0,
    },
  }),
  'ui-kit.inputs.Search.styles.ClearSearchButton'
)(ButtonIcon);

const CancelButton = styled(
  ({ theme }) => ({
    paddingLeft: theme.sizing.baseUnit, // padding away from end of search field
    color: theme.colors.text.link, // we use UIText here instead of `ButtonLink` becuase onLayout has issues with nested text on Android
  }),
  'ui-kit.inputs.Search.styles.CancelButton'
)(UIText);

export {
  SearchWrapper,
  TextInputWrapper,
  LoopIcon,
  Input,
  SmokeAndMirrorsWrapper,
  ClearSearchButtonBackground,
  ClearSearchButton,
  CancelButton,
};
