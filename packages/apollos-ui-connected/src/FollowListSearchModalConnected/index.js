import { useQuery } from '@apollo/client';
import { FollowListSearchModal } from '@apollosproject/ui-kit';
import React, { useState } from 'react';
import { get } from 'lodash';
import FollowListConnected from '../FollowListConnected';
import GET_SEARCH_PEOPLE from './getSearchPeople';

const FollowListSearchModalConnected = ({ ...props }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data } = useQuery(GET_SEARCH_PEOPLE, {
    variables: {
      name: searchTerm,
    },
    fetchPolicy: 'cache-and-network',
  });
  const people = get(data, 'searchPeople.edges', []).map(({ node }) => node);

  return (
    <FollowListSearchModal
      followers={people}
      onSearch={setSearchTerm}
      FollowListComponent={FollowListConnected}
      {...props}
    />
  );
};

export default FollowListSearchModalConnected;
