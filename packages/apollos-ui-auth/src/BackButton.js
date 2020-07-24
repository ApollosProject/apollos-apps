import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import {
  UIText,
  ButtonLink,
  styled,
  withTheme,
  Touchable,
  PaddedView,
  Icon,
} from '@apollosproject/ui-kit';

const SuppressingView = styled(
  {
    flexDirection: 'row',
  },
  'ui-auth.BackButton.SuppressingView'
)(View);

const Button = withTheme(
  ({ theme }) => ({
    borderRadius: theme.sizing.baseBorderRadius,
  }),
  'ui-auth.BackButton.Button'
)(Touchable);

const ButtonWrapper = styled(
  {
    flexDirection: 'row',
    alignItems: 'center',
  },
  'ui-auth.BackButton.ButtonWrapper'
)(PaddedView);

const BackButtonIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.action.secondary,
    size: theme.sizing.baseUnit * 1.5,
    style: {
      paddingRight: 0,
    },
  }),
  'ui-auth.BackButton.BackButtonIcon'
)(Icon);

const BackButton = ({ onPress }) => (
  <SuppressingView>
    <Button onPress={() => onPress()}>
      <ButtonWrapper>
        <BackButtonIcon name="arrow-back" />
        <UIText>
          <ButtonLink>Back</ButtonLink>
        </UIText>
      </ButtonWrapper>
    </Button>
  </SuppressingView>
);

BackButton.propTypes = {
  onPress: PropTypes.func,
};

export default BackButton;
