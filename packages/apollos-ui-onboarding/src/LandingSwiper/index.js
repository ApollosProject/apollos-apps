import React, { useRef } from 'react';
import Swiper from 'react-native-swiper';
import { named } from '@apollosproject/ui-kit';
import LandingSlide from './LandingSlide';
import defaultSlides from './defaultSlides';

function LandingSwiper({ slides = defaultSlides }) {
  const swiperRef = useRef();

  function swipeForward() {
    swiperRef.current.scrollBy(1);
  }

  return (
    <Swiper
      loadMinimal
      loop={false}
      /* Disables swipe gestures. We currently we dont display a back button so this is our
       * only back navigation option. */
      // scrollEnabled={false}
      showsButtons={false}
      ref={swiperRef}
      showsPagination={false}
    >
      {slides.map((slide, index) => (
        <LandingSlide
          key={slide.title}
          slideTitle={slide.title}
          slideDescription={slide.description}
          slideCount={slides.length}
          slideIndex={index}
          swipeForward={swipeForward}
        />
      ))}
    </Swiper>
  );
}

export default named('ui-onboarding.LandingSwiper')(LandingSwiper);
