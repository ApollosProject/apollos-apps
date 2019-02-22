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
  ButtonLink,
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
  color: theme.colors.text.secondary, // this may be too dark
}))(H5);

const NavWrapper = styled(({ theme }) => ({
  flexDirection: 'row-reverse', // reversed so the primary action is always on the right
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

const SkipButton = styled(({ theme }) => ({
  color: theme.colors.text.tertiary, // this is probably not the right color
}))(ButtonLink);

class AskName extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    screenTitle: PropTypes.string,
    description: PropTypes.string,
    onboardingScrollBy: PropTypes.func,
    onboardingSkipTo: PropTypes.number, // shows a skip button and defines how far ahead to skip
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
        {this.props.onboardingScrollBy ? (
          <NavWrapper vertical={false}>
            <Button onPress={() => this.props.onboardingScrollBy(1)}>
              <H5>Next</H5>
              <NextButtonIcon />
            </Button>
            {this.props.onboardingSkipTo ? (
              <SkipButton
                onPress={() =>
                  this.props.onboardingScrollBy(
                    this.props.onboardingSkipTo,
                    false // don't animate the skip transition
                  )
                }
              >
                Skip
              </SkipButton>
            ) : null}
          </NavWrapper>
        ) : null}
      </BackgroundView>
    );
  }
}

export default AskName;
