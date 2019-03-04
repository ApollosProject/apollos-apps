import React, { memo } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';

import { styled, H2, H5 } from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

const CoverImage = styled(({ theme }) => ({
  height: '75%',
  width: '100%',
  marginBottom: theme.sizing.baseUnit * 2,
  marginVertical: theme.sizing.baseUnit * 0.5,
  alignSelf: 'center',
}))(Image);

const CheckIcon = styled(() => ({
  height: 20,
  width: 20,
  marginRight: 5,
}))(Image);

const defaults = [
  'Grow in scripture',
  'Childcare check-in',
  'Keep up with your campus',
  'Find a community group',
  'Watch services',
  'Receive prayer',
  'Manage giving',
];

const FeatureList = memo(({ featureDescriptions }) => (
  <View style={{ position: 'absolute', top: 180, alignSelf: 'center' }}>
    {featureDescriptions.map((feature, key) => (
      <View style={{ flexDirection: 'row', margin: 5 }}>
        <CheckIcon source={require('./check.png')} />
        <StyledH5 key={key}>{feature}</StyledH5>
      </View>
    ))}
  </View>
));

const Features = memo(({ firstName, description, ...props }) => {
  const titleWithName = `Hey ${firstName}!`;
  return (
    <Slide {...props}>
      <CoverImage source={require('./mountain.jpeg')} />
      <FeatureList featureDescriptions={defaults} />
      <Title>{titleWithName}</Title>
      <StyledH5>{description}</StyledH5>
    </Slide>
  );
});

Features.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  firstName: PropTypes.string,
  description: PropTypes.string,
};

Features.defaultProps = {
  firstName: 'friend',
  description:
    "We'd like to help personalize your mobile experience so we can help you with every step on your journey.",
};

export default Features;
