import React, { Component } from 'react';
import { View, Text } from 'react-native';
// import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import { withTheme } from '@apollosproject/ui-kit';

import AskName from './AskName';

// Provides themed colors the
const ThemedSwiper = withTheme(({ theme }) => ({
  dotColor: theme.colors.background.inactive, // theme.colors.lightSecondary looks the best.
  activeDotColor: theme.colors.action.primary,
}))(({ swiperRef, ...props }) => <Swiper ref={swiperRef} {...props} />);

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

  setSwiperRef = (r) => {
    this.swiper = r;

    return this.swiper;
  };

  getSwiperScrollBy = (...props) => this.swiper.scrollBy(...props);

  render() {
    return (
      <ThemedSwiper
        showsPagination={this.state.pagination}
        onIndexChanged={this.handleOnIndexChanged}
        loop={false}
        // scrollEnabled={false}
        showsButtons={false}
        swiperRef={this.setSwiperRef}
      >
        <AskName
          screenTitle={'Welcome!'}
          description={"Every relationship starts with a name. What's yours?"}
          onboardingScrollBy={this.getSwiperScrollBy}
          onboardingSkipTo={2}
        />
        <View
          style={{ flex: 1, backgroundColor: 'salmon' }}
          title={<Text>Boom</Text>}
        >
          <Text>Hello World 1</Text>
          <Text onPress={() => this.swiper.scrollBy(1)}>Next!</Text>
          <Text onPress={() => this.swiper.scrollBy(-1)}>Previous!</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
          <Text>Hello World 2</Text>
          <Text onPress={() => this.swiper.scrollBy(1)}>Next!</Text>
          <Text onPress={() => this.swiper.scrollBy(-1)}>Previous!</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'lightyellow' }}>
          <Text>No pager!</Text>
          <Text onPress={() => this.swiper.scrollBy(1)}>Next!</Text>
          <Text onPress={() => this.swiper.scrollBy(-1)}>Previous!</Text>
        </View>
      </ThemedSwiper>
    );
  }
}

export default Onboarding;
