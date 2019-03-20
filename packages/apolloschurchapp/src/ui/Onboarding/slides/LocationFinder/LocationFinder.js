import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {
  PaddedView,
  FlexedView,
  styled,
  H2,
  H5,
  Button,
} from '@apollosproject/ui-kit';

import CampusCard from 'apolloschurchapp/src/user-settings/Locations/CampusCard';
import Slide from '../../Slide';

const getCampusAddress = (campus) =>
  `${campus.street1}\n${campus.city}, ${campus.state} ${campus.postalCode}`;

const ContentWrapper = styled({
  height: '100%',
})(View);

const Content = styled({
  justifyContent: 'flex-end',
})(PaddedView);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(H5);

// const SelectedCampusCard = styled({
//   flex: 1,
// })(CampusCard);

// memo = sfc PureComponent 💥
const LocationFinder = memo(
  ({
    children,
    slideTitle,
    description,
    buttonText,
    buttonDisabled,
    onPressButton,
    campus,
    ...props
  }) => (
    <Slide {...props}>
      <ContentWrapper>
        <FlexedView>{children}</FlexedView>
        <Content>
          <Title>{slideTitle}</Title>
          <StyledH5>{description}</StyledH5>
          {buttonDisabled || campus ? (
            <CampusCard
              key={campus.id}
              distance={campus.distanceFromLocation}
              title={campus.name}
              description={getCampusAddress(campus)}
              images={[campus.image]}
            />
          ) : (
            <Button
              title={buttonText}
              onPress={onPressButton}
              disabled={buttonDisabled}
              pill={false}
            />
          )}
        </Content>
      </ContentWrapper>
    </Slide>
  )
);

LocationFinder.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use a more unique name.
   */
  children: PropTypes.oneOfType([
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
};

LocationFinder.defaultProps = {
  slideTitle: "Let's select your local campus",
  description:
    "We'll use your location to connect you with your nearby campus and community",
  buttonText: 'Yes, find my local campus',
  buttonDisabled: false,
  secondaryNavText: 'Later',
};

export default LocationFinder;
