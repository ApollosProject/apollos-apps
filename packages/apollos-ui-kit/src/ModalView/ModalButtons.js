import React from 'react';
import Color from 'color';
import { useNavigation, useRoute } from '@react-navigation/native';

import { withTheme } from '../theme';
import { ButtonIcon } from '../Button';

const StyledButtonIcon = withTheme(({ theme }) => ({
  fill: theme.colors.white,
  size: theme.sizing.baseUnit,
  iconPadding: theme.sizing.baseUnit * 0.5, // TODO: decreases button tappability but gives us the desired "smaller button" look
  style: {
    backgroundColor: Color(theme.colors.text.primary).fade(0.3).toString(),
  },
}))(ButtonIcon);

const ModalButton = (props) => <StyledButtonIcon {...props} />;

export const ModalBackButton = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  let onPress = null;
  if (route?.state?.index > 0) {
    // pop wasn't reliable in this case
    onPress = () =>
      navigation.navigate({
        key: route.state.routes[route.state.index - 1]?.key,
      });
  }
  if (!onPress) return null;
  return <ModalButton name={'arrow-back'} onPress={onPress} {...props} />;
};

export const ModalCloseButton = (props) => {
  const navigation = useNavigation();
  const onPress = () => navigation.goBack();
  return <ModalButton name={'close'} onPress={onPress} {...props} />;
};

export default ModalButton;
