import React, { PureComponent } from 'react';
import { throttle } from 'lodash';

import { BackgroundView } from '@apollosproject/ui-kit';

import SearchInputHeader, {
  ReactNavigationStyleReset,
} from '../../ui/SearchInputHeader';

import SearchFeed from './SearchFeed';
import DiscoverFeed from './DiscoverFeed';

class Discover extends PureComponent {
  state = {
    searchValue: '',
  };

  handleOnChangeText = (value) => {
    throttle(
      this.setState({
        searchValue: value,
      }),
      300
    );
  };

  handleOnFocus = () => {
    this.setState({
      isFocused: true,
    });
  };

  render() {
    return (
      <BackgroundView>
        <SearchInputHeader onChagneText={this.handleOnChangeText} />
        <DiscoverFeed />
      </BackgroundView>
    );
  }
}

Discover.navigationOptions = {
  title: 'Discover',
  headerStyle: ReactNavigationStyleReset.header,
};

export default Discover;
