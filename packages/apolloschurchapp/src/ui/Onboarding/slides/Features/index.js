import React, { memo } from 'react';
import { Image } from 'react-native';
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
  marginBottom: theme.sizing.baseUnit * 2,
  marginVertical: theme.sizing.baseUnit,
}))(Image);

const Features = memo(({ firstName, description, ...props }) => {
  const titleWithName = `Hey ${firstName}!`;
  return (
    <Slide {...props}>
      <CoverImage source={require('./mountain.jpeg')} />
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
