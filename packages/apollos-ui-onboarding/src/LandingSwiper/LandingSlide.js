import React from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView } from 'react-native';
import { styled, PaddedView, H1, H4, H5, Button } from '@apollosproject/ui-kit';
import { useNavigation } from '@react-navigation/native';
import { times } from 'lodash';

const dotStyles = ({ theme }) => ({
  width: theme.sizing.baseUnit / 2,
  height: theme.sizing.baseUnit / 2,
  borderRadius: theme.sizing.baseUnit / 4,
  margin: theme.sizing.baseUnit / 4,
});

const Container = styled(
  () => ({
    flex: 1,
  }),
  'ui-onboarding.LandingSwiper.LandingSlide.Container'
)(View);

const ContentContainer = styled(
  () => ({ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }),
  'ui-onboarding.LandingSwiper.LandingSlide.ContentContainer'
)(View);

const DotContainer = styled(
  () => ({ flexDirection: 'row' }),
  'ui-onboarding.LandingSwiper.LandingSlide.DotContainer'
)(View);

const ButtonContainer = styled(
  () => ({ width: '100%' }),
  'ui-onboarding.LandingSwiper.LandingSlide.ButtonContainer'
)(SafeAreaView);

const Title = styled(
  ({ theme, color }) => ({
    marginVertical: theme.sizing.baseUnit,
    ...(color ? { color } : {}),
    textAlign: 'center',
  }),
  'ui-onboarding.LandingSwiper.LandingSlide.Title'
)(H1);

const Subtitle = styled(
  ({ color }) => ({
    ...(color ? { color } : {}),
    textAlign: 'center',
  }),
  'ui-onboarding.LandingSwiper.LandingSlide.Subtitle'
)(H4);

const PrimaryButton = styled(
  {},
  'ui-onboarding.LandingSwiper.LandingSlide.PrimaryButton'
)(Button);

const PaginationDot = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.background.inactive,
    ...dotStyles({ theme }),
  }),
  'ui-onboarding.LandingSwiper.PaginationDot'
)(View);

const PaginationDotActive = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.action.primary,
    ...dotStyles({ theme }),
  }),
  'ui-onboarding.LandingSwiper.PaginationDotActive'
)(View);

export default function LandingSlide({
  slideTitle,
  slideDescription,
  slideCount,
  slideIndex,
  swipeForward,
}) {
  const navigation = useNavigation();

  function onContinue() {
    if (slideIndex === slideCount - 1) {
      navigation.navigate('Auth');
    } else {
      swipeForward();
    }
  }

  return (
    <Container>
      <ContentContainer>
        <DotContainer>
          {times(slideCount, String).map((_, i) =>
            i === slideIndex ? <PaginationDotActive /> : <PaginationDot />
          )}
        </DotContainer>
        <Title>{slideTitle}</Title>
        <Subtitle>{slideDescription}</Subtitle>
      </ContentContainer>
      <ButtonContainer>
        <PaddedView>
          <PrimaryButton onPress={onContinue}>
            <H5>Continue</H5>
          </PrimaryButton>
        </PaddedView>
      </ButtonContainer>
    </Container>
  );
}

LandingSlide.propTypes = {
  slideTitle: PropTypes.string,
  slideDescription: PropTypes.string,
  slideCount: PropTypes.number,
  slideIndex: PropTypes.number,
  swipeForward: PropTypes.func,
};
