import React, { Component } from 'react';
import { View } from 'react-native';

// import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import {
  BackgroundView,
  GradientOverlayImage,
  styled,
} from '@apollosproject/ui-kit';

import { SafeAreaView } from 'react-navigation';

import {
  AskNotificationsConnected,
  AskNameConnected,
  FeaturesConnected,
  AboutYouConnected,
  LocationFinderConnected,
} from './slides';

const dotStyles = ({ theme }) => ({
  width: theme.sizing.baseUnit / 2,
  height: theme.sizing.baseUnit / 2,
  borderRadius: theme.sizing.baseUnit / 4,
  margin: theme.sizing.baseUnit / 4,
});

const forceInset = {
  bottom: 'always',
};

const PaginationDot = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.inactive,
  ...dotStyles({ theme }),
}))(View);

const PaginationDotActive = styled(({ theme }) => ({
  backgroundColor: theme.colors.action.primary,
  ...dotStyles({ theme }),
}))(View);

class Onboarding extends Component {
  static navigationOptions = () => ({
    title: 'Onboarding',
    header: null,
    gesturesEnabled: false,
  });

  swiper = null;

  // Creates ref to Swiper to be passed as a prop to children.
  setSwiperRef = (r) => {
    this.swiper = r;

    return this.swiper;
  };

  // Advance swiper 1 slide. See Swiper documentation for scrollBy details. https://github.com/leecade/react-native-swiper#methods
  handleOnPressPrimary = () => this.swiper.scrollBy(1);

  render() {
    return (
      <BackgroundView>
        <Swiper
          loadMinimal
          loop={false}
          /* Disables swipe gestures. We currently we dont display a back button so this is our
           * only back navigation option. */
          // scrollEnabled={false}
          showsButtons={false}
          ref={this.setSwiperRef}
          renderPagination={this.renderPagination}
          activeDot={
            <SafeAreaView forceInset={forceInset}>
              <PaginationDotActive />
            </SafeAreaView>
          }
          dot={
            <SafeAreaView forceInset={forceInset}>
              <PaginationDot forceInset={forceInset} />
            </SafeAreaView>
          }
        >
          <AskNameConnected onPressPrimary={this.handleOnPressPrimary} />
          <FeaturesConnected
            onPressPrimary={this.handleOnPressPrimary}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <AboutYouConnected
            onPressPrimary={this.handleOnPressPrimary}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <LocationFinderConnected
            onPressPrimary={this.handleOnPressPrimary}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
          <AskNotificationsConnected
            onPressPrimary={() => this.props.navigation.navigate('Home')}
            primaryNavText={'Finish'}
            BackgroundComponent={
              <GradientOverlayImage
                source={'https://picsum.photos/640/640/?random'}
              />
            }
          />
        </Swiper>
      </BackgroundView>
    );
  }
}

export default Onboarding;
