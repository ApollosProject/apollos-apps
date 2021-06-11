import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { styled, PaddedView, Button, named } from '@apollosproject/ui-kit';

import Slide, { SlideContent } from '../../Slide';

const StyledSlideContent = styled(
  {
    flex: 1,
    justifyContent: 'space-between',
  },
  'ui-onboarding.slides.AskNotifications.AskNotifications.StyledSlideContent'
)(SlideContent);

// memo = sfc PureComponent 💥
// eslint-disable-next-line react/display-name
const AskNotifications = memo(
  ({
    BackgroundComponent,
    slideTitle,
    description,
    buttonText,
    buttonDisabled,
    onPressButton,
    isLoading,
    ...props
  }) => (
    <Slide {...props}>
      {BackgroundComponent}
      <StyledSlideContent title={slideTitle} description={description}>
        {buttonDisabled || onPressButton ? (
          <PaddedView horizontal={false}>
            <Button
              title={buttonText}
              onPress={onPressButton}
              disabled={buttonDisabled || isLoading}
              pill={false}
            />
          </PaddedView>
        ) : null}
      </StyledSlideContent>
    </Slide>
  )
);

AskNotifications.displayName = 'AskNotifications';

AskNotifications.propTypes = {
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  /* The `Swiper` component used in `<onBoarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use a more unique name.
   */
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  onPressButton: PropTypes.func,
  isLoading: PropTypes.bool,
};

AskNotifications.defaultProps = {
  slideTitle: 'Can we keep you informed?',
  description:
    "We'll let you know when important things are happening and keep you in the loop",
  buttonText: 'Yes, enable notifications',
  buttonDisabled: false,
};

export default named('ui-onboarding.AskNotifications')(AskNotifications);
