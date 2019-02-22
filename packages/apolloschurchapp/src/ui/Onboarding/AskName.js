import React, { PureComponent } from 'react';

import {
  styled,
  withTheme,
  BackgroundView,
  FlexedView,
  PaddedView,
  H2,
  H5,
  TextInput,
  ButtonIcon,
  Icon,
} from '@apollosproject/ui-kit';

const NextButton = withTheme(({ theme }) => ({
  backgroundColor: theme.colors.action.primary,
  fill: theme.colors.white,
  size: theme.helpers.rem(1.25),
  iconPadding: theme.helpers.rem(0.875),
  style: { alignSelf: 'flex-end' },
}))(ButtonIcon);

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

class AskName extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <BackgroundView>
        <FlexedView>
          <PaddedView>
            <BrandIcon />
            <Title>Welcome!</Title>
            <StyledH5>
              {"Every relationship starts with a name. What's yours?"}
            </StyledH5>
            <TextInput
              label="First Name"
              type="text"
              returnKeyType="next"
              onSubmitEditing={() => this.LastNameInput.focus()}
              enablesReturnKeyAutomatically
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
        <NavWrapper vertical={false}>
          <NextButton
            onPress={() => {}}
            name="arrow-next"
            aria-label={'Next Screen'}
          />
        </NavWrapper>
      </BackgroundView>
    );
  }
}

export default AskName;
