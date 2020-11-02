import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import * as ReactIs from 'react-is';
import Color from 'color';
import { SafeAreaView } from 'react-native-safe-area-context';

import Swiper from 'react-native-swiper';
import { styled, withTheme } from '@apollosproject/ui-kit';

const dotStyles = ({ theme }) => ({
  width: theme.sizing.baseUnit * 1.5,
  height: theme.sizing.baseUnit * 0.125,
  borderRadius: theme.sizing.baseUnit * 0.125,
  marginHorizontal: theme.sizing.baseUnit * 0.0625,
});

const PaginationDot = styled(
  ({ theme }) => ({
    backgroundColor: Color(theme.colors.text.primary)
      .fade(theme.alpha.high)
      .string(),
    ...dotStyles({ theme }),
  }),
  'ui-prayer.PrayerSwiper.PaginationDot'
)(View);

const PaginationDotActive = styled(
  ({ theme }) => ({
    backgroundColor: theme.colors.action.primary,
    ...dotStyles({ theme }),
  }),
  'ui-prayer.PrayerSwiper.PaginationDot.Active'
)(View);

const StyledPrayerSwiper = withTheme(
  ({ theme, orientation }) => ({
    paginationStyle: {
      ...(orientation === 'landscape' ? { top: theme.sizing.baseUnit } : {}), // fixes pagination placement in landscape mode
      bottom: null, // pagination by default is rendered absolute bottom. This "overrides" that style declaration.
      left: theme.sizing.baseUnit,
      justifyContent: 'flex-start',
      alignItem: 'flex-start',
    },
  }),
  'ui-prayer.PrayerSwiper.StyledPrayerSwiper'
)(({ swiperRef, ...otherProps }) => <Swiper ref={swiperRef} {...otherProps} />);

class PrayerSwiper extends Component {
  static navigationOptions = () => ({
    title: 'Prayer',
    header: null,
    gesturesEnabled: false,
  });

  static propTypes = {
    children: PropTypes.func.isRequired,
    index: PropTypes.number,
  };

  swiper = null;

  getOrientation = () => {
    if (Dimensions.get('window').width > Dimensions.get('window').height) {
      return 'landscape';
    }
    return 'portrait';
  };

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

    /* The user can pass either a set of components in a fragment, or an array of components.
     * If the uses a fragment, we need to remove the fragment and render the components directly
     * otherwise the slider will treat the fragment as a single slide. */
    let slides = children;
    if (ReactIs.typeOf(children) === ReactIs.Fragment) {
      slides = children.props.children;
    }

    return (
      <StyledPrayerSwiper
        index={this.props.index}
        loadMinimal
        loop={false}
        /* Disables swipe gestures. We currently dont display a back button so this is our
         * only back navigation option. */
        // scrollEnabled={false}
        showsButtons={false}
        swiperRef={this.setSwiperRef}
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
        orientation={this.getOrientation()}
      >
        {slides}
      </StyledPrayerSwiper>
    );
  }
}

export default PrayerSwiper;
