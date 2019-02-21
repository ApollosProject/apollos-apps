import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Swiper from 'react-native-swiper';

class Onboarding extends Component {
  constructor() {
    super();

    this.swiper = null;

    this.state = { pagination: true };
  }

  togglePagination = () => {
    if (this.currentIndex === 2 || this.state.pagination === false) {
      this.setState((state) => ({
        pagination: !state.pagination,
      }));
    }
  };

  handleOnIndexChanged = (index) => {
    this.currentIndex = index;

    this.togglePagination();

    return this.currentIndex;
  };

  render() {
    return (
      <>
        <Swiper
          showsPagination={this.state.pagination}
          onIndexChanged={this.handleOnIndexChanged}
          loop={false}
          scrollEnabled={false}
          showsButtons={false}
          ref={(ref) => (this.swiper = ref)}
        >
          <View style={{ flex: 1, backgroundColor: 'salmon' }}>
            <Text>Hello World 1</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'cyan' }}>
            <Text>Hello World 2</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'lightyellow' }}>
            <Text>No pager!</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
            <Text>Hello World 3</Text>
          </View>
        </Swiper>
        <Text onPress={() => this.swiper.scrollBy(1)}>Next!</Text>
        <Text onPress={() => this.swiper.scrollBy(-1)}>Previous!</Text>
      </>
    );
  }
}

export default Onboarding;
