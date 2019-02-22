import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  BackgroundView,
  FlexedView,
  PaddedView,
  H2,
  H5,
  TextInput,
  Button,
  Icon,
} from '@apollosproject/ui-kit';

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

const NavWrapper = styled(({ theme }) => ({
  flexDirection: 'row-reverse',
  alignItems: 'center', // centers optional back button with dots/next button
  justifyContent: 'space-between',
  marginBottom: theme.sizing.baseUnit * 0.5, // centers nav/button with pager dots
}))(PaddedView);

const NextButtonIcon = withTheme(({ theme }) => ({
  name: 'arrow-next',
  size: theme.helpers.rem(1.25),
  style: {
    marginLeft: theme.sizing.baseUnit * 0.5,
    marginRight: theme.sizing.baseUnit * -0.5,
  },
}))(Icon);

class AskName extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    screenTitle: PropTypes.string,
    description: PropTypes.string,
    onboardingControl: PropTypes.func,
  };

  constructor() {
    super();

    this.AskName = null;
  }

  render() {
    return (
      <BackgroundView>
        <FlexedView>
          <PaddedView>
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
              inputRef={(r) => {
                this.LastNameInput = r;
              }}
            />
          </PaddedView>
        </FlexedView>
        {this.props.onboardingControl ? (
          <NavWrapper vertical={false}>
            <Button onPress={() => this.props.onboardingControl(1)}>
              <H5>Next</H5>
              <NextButtonIcon />
            </Button>
          </NavWrapper>
        ) : null}
      </BackgroundView>
    );
  }
}

export default AskName;
