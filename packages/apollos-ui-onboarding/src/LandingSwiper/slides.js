import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  H3,
  H5,
  styled,
  Icon,
  named,
  ButtonLink,
} from '@apollosproject/ui-kit';

import LandingSlide from './LandingSlide';
import {
  PlaceholderPost,
  PlaceholderPrayer,
  PlaceholderGroup,
  PlaceholderSpringboard,
} from './placeholders';

import { Post, Notification, Prompt } from './callouts';
import AnimatedAppIcon from './AnimatedAppIcon';

const TextContainer = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  width: '58%',
  alignItems: 'center',
  textAlign: 'center',
  alignSelf: 'center',
}))(View);

const Title = styled({ textAlign: 'center' })(H3);
const SubTitle = styled({ textAlign: 'center' })(H5);

export const Intro = named('ui-onboarding.LandingSwiper.slides.Intro')(
  ({ onPressLogin, ...slideProps }) => {
    const navigation = useNavigation();
    const onPress = useCallback(
      () =>
        onPressLogin
          ? onPressLogin()
          : navigation.navigate('IdentityEntryConnected', {
              newUser: false,
            }),
      [onPressLogin, navigation]
    );
    return (
      <LandingSlide
        screenChildren={<PlaceholderSpringboard />}
        calloutChildren={<AnimatedAppIcon />}
        calloutLocation="centered"
        secondaryButtonChildren={
          <H5 secondary padded centered>
            Already have an account?{' '}
            <ButtonLink onPress={onPress}>Log in →</ButtonLink>
          </H5>
        }
        {...slideProps}
      >
        <TextContainer>
          <Icon name="brand-logo" size={60} />
          <SubTitle secondary>
            Build a daily spiritual habit with others.
          </SubTitle>
        </TextContainer>
      </LandingSlide>
    );
  }
);

export const Scripture = named('ui-onboarding.LandingSwiper.slides.Scripture')(
  ({
    profile,
    title = 'Grow in Scripture',
    subtitle = 'Journal & reflect with others reading scripture.',
    ...slideProps
  }) => (
    <LandingSlide
      screenChildren={
        <>
          <PlaceholderPost />
          <PlaceholderPost title="" />
        </>
      }
      calloutChildren={<Post profile={profile} />}
      calloutLocation="centered"
      {...slideProps}
    >
      <TextContainer>
        <Title>{title}</Title>
        <SubTitle secondary>{subtitle}</SubTitle>
      </TextContainer>
    </LandingSlide>
  )
);

export const Prayer = named('ui-onboarding.LandingSwiper.slides.Prayer')(
  ({
    notificationName,
    profile,
    title = 'Pray with\neach other',
    subtitle = 'Share & encourage each other in a meaningful habit.',
    ...slideProps
  }) => (
    <LandingSlide
      screenChildren={<PlaceholderPrayer profile={profile} />}
      calloutChildren={<Notification name={notificationName} />}
      calloutLocation="top"
      {...slideProps}
    >
      <TextContainer>
        <Title>{title}</Title>
        <SubTitle secondary>{subtitle}</SubTitle>
      </TextContainer>
    </LandingSlide>
  )
);

export const Community = named('ui-onboarding.LandingSwiper.slides.Community')(
  ({
    groupName,
    groupAvatars,
    prompt,
    title = 'Be in community',
    subtitle = 'Be known, grow and live life with those close to you.',
    ...slideProps
  }) => (
    <LandingSlide
      screenChildren={
        <PlaceholderGroup name={groupName} avatars={groupAvatars} />
      }
      calloutChildren={<Prompt prompt={prompt} />}
      calloutLocation="bottom"
      {...slideProps}
    >
      <TextContainer>
        <Title>{title}</Title>
        <SubTitle secondary>{subtitle}</SubTitle>
      </TextContainer>
    </LandingSlide>
  )
);
