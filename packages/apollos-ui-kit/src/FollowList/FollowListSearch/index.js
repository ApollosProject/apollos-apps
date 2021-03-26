import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView } from 'react-native';
import FollowList from '..';
import Search from '../../inputs/Search';
import styled from '../../styled';
import { withTheme } from '../../theme';

const SearchContainer = styled(({ theme }) => ({
  marginHorizontal: theme.sizing.baseUnit,
}))(View);

const StyledSearch = withTheme(({ theme }) => ({
  screenBackgroundColor: theme.colors.background.paper,
}))(Search);

const FullHeightScrollView = styled({ height: '100%' })(ScrollView);

function FollowListSearch({ onSearch, FollowListComponent, ...props }) {
  const [searchTimeout, setSearchTimeout] = useState();
  const [searchTimer, setSearchTimer] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimeout);
      const timeout = setTimeout(() => {
        onSearch(search);
      }, 500);
      setSearchTimer(false);
      setSearchTimeout(timeout);
    }
    return () => {
      clearTimeout(searchTimeout);
    };
  }, [onSearch, search, searchTimeout, searchTimer]);
  return (
    <>
      <SearchContainer>
        <StyledSearch
          showCancelButton={false}
          onChangeText={(value) => {
            setSearch(value);
            setSearchTimer(true);
          }}
        />
      </SearchContainer>
      <FullHeightScrollView>
        <FollowListComponent {...props} />
      </FullHeightScrollView>
    </>
  );
}

FollowListSearch.propTypes = {
  onSearch: PropTypes.func,
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  onFollow: PropTypes.func,
  FollowListComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

FollowListSearch.defaultProps = {
  onSearch: () => {},
  FollowListComponent: FollowList,
};

export default FollowListSearch;
