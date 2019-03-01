import React, { Component } from 'react';
import { Text } from 'react-native';
// import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import {
  withTheme,
  styled,
  BackgroundView,
  FlexedView,
} from '@apollosproject/ui-kit';

import { AskName } from './slides';

// Provides themed colors to Swiper dots
const ThemedSwiper = withTheme(({ theme }) => ({
  dotColor: theme.colors.background.inactive, // theme.colors.lightSecondary looks the best.
  activeDotColor: theme.colors.action.primary,
}))(({ swiperRef, ...props }) => <Swiper ref={swiperRef} {...props} />);

const Boom = styled(({ bgcolor }) => ({
  backgroundColor: bgcolor,
}))(FlexedView);

class Onboarding extends Component {
  constructor() {
    super();

    this.swiper = null;
    this.state = { pagination: true };
  }

  handleOnIndexChanged = (index) => {
    this.currentIndex = index;

    this.togglePagination();

    return this.currentIndex;
  };

  togglePagination = () => {
    if (this.currentIndex === 2 || this.state.pagination === false) {
      this.setState((state) => ({
        pagination: !state.pagination,
      }));
    }
  };

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
        <ThemedSwiper
          showsPagination={this.state.pagination}
          onIndexChanged={this.handleOnIndexChanged}
          loop={false}
          /* Disables swipe gestures. We currently we don't display a back button so this is our
           * only back navigation option. */
          // scrollEnabled={false}
          showsButtons={false}
          swiperRef={this.setSwiperRef}
        >
          <AskName onPressPrimary={this.handleOnPressPrimary} />
          <Boom bgcolor={'salmon'}>
            <Text>Hello World 1</Text>
            <Text onPress={() => this.swiper.scrollBy(1)}>Next!</Text>
            <Text onPress={() => this.swiper.scrollBy(-1)}>Previous!</Text>
          </Boom>
          <Boom bgcolor={'lightgreen'}>
            <Text>Hello World 2</Text>
            <Text onPress={() => this.swiper.scrollBy(1)}>Next!</Text>
            <Text onPress={() => this.swiper.scrollBy(-1)}>Previous!</Text>
          </Boom>
          <Boom bgcolor={'lightyellow'}>
            <Text>No pager!</Text>
            <Text onPress={() => this.swiper.scrollBy(1)}>Next!</Text>
            <Text onPress={() => this.swiper.scrollBy(-1)}>Previous!</Text>
          </Boom>
        </ThemedSwiper>
      </BackgroundView>
    );
  }
}

export default Onboarding;
