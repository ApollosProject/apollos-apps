import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import * as ReactIs from 'react-is';

import Swiper from 'react-native-swiper';
import { styled } from '@apollosproject/ui-kit';

import { SafeAreaView } from 'react-navigation';

const dotStyles = ({ theme }) => ({
  width: theme.sizing.baseUnit / 2,
  height: theme.sizing.baseUnit / 2,
  borderRadius: theme.sizing.baseUnit / 4,
  margin: theme.sizing.baseUnit / 4,
});

const forceInset = {
  bottom: 'always',
};

const PaginationDot = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.background.inactive,
    ...dotStyles({ theme }),
  }),
  'ui-onboarding.OnboardingSwiper.PaginationDot'
)(View);

const PaginationDotActive = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.action.primary,
    ...dotStyles({ theme }),
  }),
  'ui-onboarding.OnboardingSwiper.PaginationDotActive'
)(View);

class OnboardingSwiper extends Component {
  static navigationOptions = () => ({
    title: 'Onboarding',
    header: null,
    gesturesEnabled: false,
  });

  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  swiper = null;

  // Creates ref to Swiper to be passed as a prop to children.
  setSwiperRef = (r) => {
    this.swiper = r;

    return this.swiper;
  };

  // Advance swiper 1 slide. See Swiper documentation for scrollBy details. https://github.com/leecade/react-native-swiper#methods
  swipeForward = () => this.swiper.scrollBy(1);

  scrollBy = (...args) => this.swiper.scrollBy(...args);

  render() {
    const children = this.props.children({
      swipeForward: this.swipeForward,
      scrollBy: this.scrollBy,
    });

    // The user can pass either a set of components in a fragment, or an array of components.
    // If the uses a fragment, we need to remove the fragment and render the components directly.
    // Otherwise the slider will treat the fragment as a single slide.
    let slides = children;
    if (ReactIs.typeOf(children) === ReactIs.Fragment) {
      slides = children.props.children;
    }

    return (
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
        {...this.props}
      >
        {slides}
      </Swiper>
    );
  }
}

export default OnboardingSwiper;
