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
    searchText: '',
  };

  handleOnChangeText = throttle(
    (value) =>
      this.setState({
        searchText: value,
      }),
    300
  );

  handleOnFocus = () => {
    this.setState({
      isFocused: true,
    });
  };

  render() {
    return (
      <BackgroundView>
        <SearchInputHeader onChangeText={this.handleOnChangeText} />
        {this.state.isFocused || this.state.searchText ? (
          <SearchFeed searchText={this.state.searchText} />
        ) : (
          <DiscoverFeed />
        )}
      </BackgroundView>
    );
  }
}

Discover.navigationOptions = {
  title: 'Discover',
  headerStyle: ReactNavigationStyleReset.header,
};

export default Discover;
