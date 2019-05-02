import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { PaddedView, styled, Button, Touchable } from '@apollosproject/ui-kit';

import CampusCard from 'apolloschurchapp/src/user-settings/Locations/CampusCard';

import Slide, { SlideContent } from '../../Slide';

const getCampusAddress = (campus) =>
  `${campus.street1}\n${campus.city}, ${campus.state} ${campus.postalCode}`;

const StyledCampusCard = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(CampusCard);

const StyledSlideContent = styled({
  flex: 1,
  justifyContent: 'space-between',
})(SlideContent);

// memo = sfc PureComponent 💥
// eslint-disable-next-line react/display-name
const LocationFinder = memo(
  ({
    onPressPrimary,
    BackgroundComponent,
    slideTitle,
    description,
    buttonText,
    buttonDisabled,
    onPressButton,
    isCurrentCampus,
    campus,
    ...props
  }) => (
    <Slide
      onPressPrimary={
        campus /* show the primary action button (next) if we have a campus */
          ? onPressPrimary
          : null
      }
      onPressSecondary={
        !campus /* show the secondary action button (skip) if we don't have a campus */
          ? onPressPrimary
          : null
      }
      {...props}
    >
      {BackgroundComponent}
      <StyledSlideContent title={slideTitle} description={description}>
        {campus ? (
          <Touchable onPress={onPressButton}>
            <StyledCampusCard
              key={campus.id}
              distance={campus.distanceFromLocation}
              title={campus.name}
              description={getCampusAddress(campus)}
              images={[campus.image]}
            />
          </Touchable>
        ) : (
          <PaddedView horizontal={false}>
            <Button
              title={buttonText}
              onPress={onPressButton}
              disabled={buttonDisabled}
              pill={false}
            />
          </PaddedView>
        )}
      </StyledSlideContent>
    </Slide>
  )
);

LocationFinder.propTypes = {
  /* The `Swiper` component used in `<Onboarding>` looks for and hijacks the title prop of it's
   * children. Thus we have to use a more unique name.
   */
  onPressPrimary: PropTypes.func,
  BackgroundComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  onPressButton: PropTypes.func,
  campus: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  isCurrentCampus: PropTypes.bool,
};

LocationFinder.defaultProps = {
  slideTitle: "Let's select your local campus",
  description:
    "We'll use your location to connect you with your nearby campus and community",
  buttonText: 'Yes, find my local campus',
  buttonDisabled: false,
};

export default LocationFinder;
