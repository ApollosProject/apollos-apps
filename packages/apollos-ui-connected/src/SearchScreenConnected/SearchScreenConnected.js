import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { useNavigation } from '@react-navigation/core';

import { styled } from '@apollosproject/ui-kit';
import {
  SearchFeedConnected,
  SearchInputHeader,
} from '@apollosproject/ui-connected';

const SearchBackground = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
}))(View);

const HeaderContainer = styled({
  paddingTop: 8,
})(View);

const SearchContainer = styled({ height: '100%' })(View);

function SearchScreenConnected(props) {
  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(true);

  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  useEffect(() => {
    if (!isFocused && searchText === '') {
      props.navigation.pop();
    }
  }, [isFocused]);

  const navigation = useNavigation();

  const handleOnPressItem = ({ item }) => {
    const id = item?.node?.id;
    navigation.pop();
    return navigation.navigate('ContentSingle', {
      itemId: id,
      transitionKey: item.transitionKey,
    });
  };

  return (
    <SearchBackground>
      <SafeAreaView edges={['right', 'left']}>
        <HeaderContainer>
          <SearchInputHeader
            onChangeText={throttle(setSearchText, 300)}
            onFocus={setIsFocused}
            inputRef={searchRef}
          />
        </HeaderContainer>
        <SearchContainer>
          <SearchFeedConnected
            searchText={searchText}
            onPressItem={(item) => handleOnPressItem({ item })}
          />
        </SearchContainer>
      </SafeAreaView>
    </SearchBackground>
  );
}

SearchScreenConnected.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    setParams: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default SearchScreenConnected;
