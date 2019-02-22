import React, { PureComponent } from 'react';

import {
  styled,
  withTheme,
  BackgroundView,
  FlexedView,
  PaddedView,
  H1,
  H4,
  TextInput,
  ButtonIcon,
} from '@apollosproject/ui-kit';

const NextButton = withTheme(({ theme }) => ({
  backgroundColor: theme.colors.action.primary,
  fill: theme.colors.white,
  size: theme.helpers.rem(1.25),
  iconPadding: theme.helpers.rem(0.875),
  style: { alignSelf: 'flex-end' },
}))(ButtonIcon);

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
            {/* TODO: add App Icon */}
            <H1>Welcome!</H1>
            <H4 padded>
              {"Every relationship starts with a name. What's yours?"}
            </H4>
            <TextInput
              label="First Name"
              type="text"
              returnKeyType="next"
              onSubmitEditing={() => this.LastNameInput.focus()}
              enablesReturnKeyAutomatically
            />
            <TextInput
              label="Last name"
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
            // backgroundColor={'salmon'}
          />
        </NavWrapper>
      </BackgroundView>
    );
  }
}

export default AskName;
