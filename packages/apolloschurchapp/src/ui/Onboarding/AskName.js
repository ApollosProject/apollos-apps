import React, { PureComponent } from 'react';
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
  color: theme.colors.text.secondary, // this may be too dark
}))(H5);

class AskName extends PureComponent {
  static propTypes = {
    screenTitle: PropTypes.string,
    description: PropTypes.string,
    onboardingScrollBy: PropTypes.func,
    onboardingSkipTo: PropTypes.number, // shows a skip button and defines how far ahead to skip
  };

  constructor() {
    super();

    this.LastNameInput = null;
  }

  setLastNameInputRef = (r) => {
    this.LastNameInput = r;

    return this.LastNameInput;
  };

  render() {
    return (
      <Screen
        onboardingScrollBy={this.props.onboardingScrollBy}
        onboardingSkipTo={this.props.onboardingSkipTo}
      >
        <BrandIcon />
        <Title>{this.props.screenTitle}</Title>
        <StyledH5>{this.props.description}</StyledH5>
        <TextInput
          label="First Name"
          type="text"
          returnKeyType="next"
          onSubmitEditing={() => this.LastNameInput.focus()}
          enzblesReturnKeyAutomatically
        />
        <TextInput
          label="Last Name"
          type="text"
          returnKeyType="next"
          enablesReturnKeyAutomatically
          inputRef={this.setLastNameInputRef}
        />
      </Screen>
    );
  }
}

export default AskName;
