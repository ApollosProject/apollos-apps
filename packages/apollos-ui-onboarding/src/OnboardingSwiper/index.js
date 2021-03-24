import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import * as ReactIs from 'react-is';
import { SafeAreaView } from 'react-native-safe-area-context';

import Swiper from 'react-native-swiper';
import { styled } from '@apollosproject/ui-kit';

const dotStyles = ({ theme }) => ({
  width: theme.sizing.baseUnit / 2,
  height: theme.sizing.baseUnit / 2,
  borderRadius: theme.sizing.baseUnit / 4,
  margin: theme.sizing.baseUnit / 4,
});

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
    userVersion: PropTypes.number,
    onComplete: PropTypes.func,
  };

  static defaultProps = {
    userVersion: 0,
  };

  swiper = null;

  constructor(props) {
    super(props);

    this.state = { index: 0 };
  }

  // Creates ref to Swiper to be passed as a prop to children.
  setSwiperRef = (r) => {
    this.swiper = r;

    return this.swiper;
  };

  get slides() {
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

    const unseenSlides = slides.filter((slide) => {
      const slideVersion = slide.props.version || 1; // slides without a version are version 1. Consider version 0 "pre slides"
      return slideVersion > this.props.userVersion;
    });

    return unseenSlides;
  }

  // Advance swiper 1 slide. See Swiper documentation for scrollBy details. https://github.com/leecade/react-native-swiper#methods
  swipeForward = () => {
    this.swiper.scrollBy(1);
    if (this.slides.length - 1 === this.state.index) {
      this.props?.onComplete();
    }
  };

  scrollBy = (...args) => this.swiper.scrollBy(...args);

  render() {
    return (
      <Swiper
        loadMinimal
        loop={false}
        /* Disables swipe gestures. We currently we dont display a back button so this is our
         * only back navigation option. */
        // scrollEnabled={false}
        showsButtons={false}
        ref={this.setSwiperRef}
        onIndexChanged={(index) => this.setState({ index })}
        renderPagination={this.renderPagination}
        activeDot={
          <SafeAreaView>
            <PaginationDotActive />
          </SafeAreaView>
        }
        dot={
          <SafeAreaView>
            <PaginationDot />
          </SafeAreaView>
        }
        {...this.props}
      >
        {this.slides}
      </Swiper>
    );
  }
}

export default OnboardingSwiper;
