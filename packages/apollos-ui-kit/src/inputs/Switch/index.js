import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { Switch, View } from 'react-native';

import { withTheme } from '../../theme';
import FlexedView from '../../FlexedView';
import styled from '../../styled';
import Touchable from '../../Touchable';

import InputAddon, { AddonRow } from '../InputAddon';
import { LabelText } from '../FloatingLabel';
import InputWrapper from '../InputWrapper';
import { withInputControlViewStyles } from '../withInputControlStyles';
import ErrorText from '../ErrorText';

const ControlWrapper = withInputControlViewStyles(View);

const enhance = compose(
  pure,
  withTheme(({ theme }) => ({
    trackColor: {
      true: theme.colors.secondary,
      false: theme.colors.background.inactive,
    },
    thumbColor: theme.colors.background.paper,
    ios_backgroundColor: theme.colors.background.inactive,
  }))
);

const LabelContainer = styled({
  justifyContent: 'center',
})(FlexedView);

const Text = enhance(
  ({
    label,
    prefix,
    error,
    wrapperStyle,
    onValueChange,
    value,
    ...switchProps
  }) => (
    <InputWrapper style={wrapperStyle}>
      <ControlWrapper>
        <AddonRow>
          <InputAddon>{prefix}</InputAddon>
          <LabelContainer>
            <Touchable onPress={() => onValueChange(!value)}>
              <LabelText>{label}</LabelText>
            </Touchable>
          </LabelContainer>
          <InputAddon>
            <Switch
              value={value}
              onValueChange={onValueChange}
              {...switchProps}
            />
          </InputAddon>
        </AddonRow>
      </ControlWrapper>

      {error && typeof error === 'string' ? (
        <ErrorText>{error}</ErrorText>
      ) : null}
    </InputWrapper>
  )
);

Text.propTypes = {
  label: PropTypes.node,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default Text;
