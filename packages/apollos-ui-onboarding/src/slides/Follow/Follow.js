import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { FollowListConnected } from '@apollosproject/ui-connected';
import { named } from '@apollosproject/ui-kit';
import Slide, { SlideContent } from '../../Slide';

const Follow = memo(
  ({
    BackgroundComponent,
    slideTitle,
    description,
    followers,
    primaryNavText,
    ...props
  }) => (
    <Slide primaryNavText={primaryNavText} {...props}>
      {BackgroundComponent}
      <SlideContent title={slideTitle} description={description}>
        <FollowListConnected followers={followers} />
      </SlideContent>
    </Slide>
  )
);

Follow.displayName = 'Follow';

Follow.propTypes = {
  followers: PropTypes.arrayOf(PropTypes.object),
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  primaryNavText: PropTypes.string,
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  /* Recommended usage:
   * - `Image` (react-native)
   * - `GradientOverlayImage` (@apollosproject/ui-kit) for increased readability
   * - `Video` (react-native-video) because moving pictures!
   */
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Follow.defaultProps = {
  slideTitle: 'Get connected',
  description: 'Follow others to stay up to date with your church community.',
  followers: [],
  primaryNavText: 'Finish',
};

export default named('ui-onboarding.Follow')(Follow);
