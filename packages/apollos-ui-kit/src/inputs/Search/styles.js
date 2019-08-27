import { View, TextInput } from 'react-native';

import styled from '../../styled';
import { withTheme } from '../../theme';
import Icon from '../../Icon';
import { ButtonIcon, ButtonLink } from '../../Button';

const SearchWrapper = styled(
  ({ theme, disabled }) => ({
    overflow: 'hidden',
    ...(disabled ? { opacity: theme.alpha.medium } : {}),
  }),
  'ui-kit.inputs.Search.SearchWrapper'
)(View);

const TextInputWrapper = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    borderRadius: theme.sizing.baseUnit,
    backgroundColor: theme.colors.background.screen,
    overflow: 'hidden',
  }),
  'ui-kit.inputs.Search.InputWrapper'
)(View);

const LoopIcon = withTheme(({ theme, isFocused }) => ({
  fill: isFocused ? theme.colors.action.secondary : theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  style: {
    marginLeft: theme.sizing.baseUnit,
  },
}))(Icon);

const Input = withTheme(
  ({ theme, forwardedRef, showClearSearchButton, cancelButtonOffset }) => ({
    placeholderTextColor: theme.colors.text.tertiary,
    selectionColor: theme.colors.action.secondary,
    ref: forwardedRef,
    style: {
      flexGrow: 1, // fixes weird text behind icon (ios) and placeholder clipping (android) bugs
      height: theme.helpers.rem(2.5), // we have to have a height to make this display correctly. using typographic unit to scale with text size.
      paddingVertical: 0, // removes weird "default" padding
      paddingLeft: theme.sizing.baseUnit * 0.5,
      paddingRight: showClearSearchButton // we have to dynamically adjust the padding otherwise it causes the placeholder text to disappear
        ? cancelButtonOffset + theme.sizing.baseUnit * 5
        : 0, // `CancelButton` + padding + `ClearSearchButton` + a 🧙‍24px 🤷‍
      // marginRight: theme.sizing.baseUnit * 2.5,
      fontSize: theme.helpers.rem(0.875),
      fontFamily: theme.typography.sans.medium.default,
    },
  })
)(TextInput);

// the main reason this component lives here is because we need access to theme colors
const SmokeAndMirrorsWrapper = styled(
  ({ theme, screenBackgroundColor }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: screenBackgroundColor || theme.colors.background.paper,
  }),
  'ui-kit.inputs.Search.SmokeAndMirrorsWrapper'
)(View);

const ClearSearchButtonBackground = styled(
  ({ theme }) => ({
    marginRight: theme.sizing.baseUnit,
    borderTopRightRadius: theme.sizing.baseUnit,
    borderBottomRightRadius: theme.sizing.baseUnit,
    backgroundColor: theme.colors.background.screen,
    overflow: 'hidden', // fixes ios border radius bug
  }),
  'ui-kit.inputs.Search.ClearSearchButtonBackground'
)(View);

const ClearSearchButton = withTheme(({ theme, isVisible }) => ({
  fill: theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  iconPadding: theme.helpers.rem(0.75),
  style: {
    opacity: isVisible ? 1 : 0,
  },
}))(ButtonIcon);

const CancelButton = styled(
  ({ theme }) => ({
    paddingRight: theme.sizing.baseUnit, // padding for the edge of the screen.
  }),
  'ui-kit.inputs.Search.CancelButton'
)(ButtonLink);

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
