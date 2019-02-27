import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  H2,
  H5,
  TextInput,
  Icon,
} from '@apollosproject/ui-kit';

import Screen from './Screen';

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.primary,
  style: { marginBottom: theme.sizing.baseUnit * 0.5 },
}))(Icon);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

// memo = sfc PureComponent 💥
const AskName = memo(({ screenTitle, description, ...props }) => {
  let LastNameInput = null;

  return (
    <Screen {...props}>
      <BrandIcon />
      <Title>{screenTitle}</Title>
      <StyledH5>{description}</StyledH5>
      <TextInput
        label="First Name"
        type="text"
        returnKeyType="next"
        onSubmitEditing={() => LastNameInput.focus()}
        enzblesReturnKeyAutomatically
      />
      <TextInput
        label="Last Name"
        type="text"
        returnKeyType="next"
        enablesReturnKeyAutomatically
        inputRef={(r) => {
          LastNameInput = r;
        }}
      />
    </Screen>
  );
});

AskName.propTypes = {
  screenTitle: PropTypes.string,
  description: PropTypes.string,
};

AskName.defaultProps = {
  screenTitle: 'Welcome!',
  description: "Every relationship starts with a name. What's yours?",
};

export default AskName;
