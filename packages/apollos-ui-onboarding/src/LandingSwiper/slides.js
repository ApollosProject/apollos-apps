import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  H1,
  H3,
  H5,
  styled,
  Icon,
  named,
  ButtonLink,
  useTheme,
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

const CustomIntroTextContainer = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 2,
  alignItems: 'flex-start',
  textAlign: 'flex-start',
  alignSelf: 'flex-start',
}))(View);

const ItemContainer = styled(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  paddingTop: theme.sizing.baseUnit,
}))(View);

const Greeting = styled({ textAlign: 'left' })(H5);
const LeftSubTitle = styled(({ theme }) => ({
  color: theme.colors.secondary,
  textAlign: 'left',
}))(H1);
const Title = styled({ textAlign: 'center' })(H3);
const SubTitle = styled({ textAlign: 'center' })(H5);
const ItemText = styled(({ theme }) => ({
  lineHeight: 32,
  paddingLeft: theme.sizing.baseUnit,
}))(H5);

const SlideText = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <View style={styles.textContainer(theme)}>
      <Title>{title}</Title>
      <SubTitle secondary>{subtitle}</SubTitle>
    </View>
  );
};

export const Intro = named('ui-onboarding.LandingSwiper.slides.Intro')(
  ({
    onPressLogin,
    listItems,
    greeting,
    appIconSize,
    subtitle = 'Build a daily spiritual habit with others.',
    ...slideProps
  }) => {
    const theme = useTheme();
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
        calloutChildren={<AnimatedAppIcon size={appIconSize} />}
        calloutLocation={greeting ? 'top-mid' : 'centered'}
        secondaryButtonChildren={
          <H5 secondary padded centered>
            Already have an account?{' '}
            <ButtonLink onPress={onPress}>Log in →</ButtonLink>
          </H5>
        }
        {...slideProps}
      >
        {greeting ? (
          <CustomIntroTextContainer>
            <Greeting secondary>{greeting}</Greeting>
            <LeftSubTitle primary>{subtitle}</LeftSubTitle>
            {listItems?.map((item, i) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <ItemContainer key={i}>
                  <Icon
                    name={item.icon}
                    weight="fill"
                    fill={theme.colors.text.secondary}
                  />
                  <ItemText primary>{item.text}</ItemText>
                </ItemContainer>
              );
            })}
          </CustomIntroTextContainer>
        ) : (
          <View style={styles.textContainer(theme)}>
            <View style={styles.wordmarkContainer(theme)}>
              <Icon name="brand-logo" size={60} />
            </View>
            <SubTitle secondary>{subtitle}</SubTitle>
          </View>
        )}
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
      <SlideText title={title} subtitle={subtitle} />
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
      <SlideText title={title} subtitle={subtitle} />
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
      <SlideText title={title} subtitle={subtitle} />
    </LandingSlide>
  )
);

const styles = StyleSheet.create({
  wordmarkContainer: (theme) => ({
    marginBottom: theme.sizing.baseUnit,
  }),
  textContainer: (theme) => ({
    padding: theme.sizing.baseUnit,
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  }),
});
