import React from 'react';
import FollowList from '..';
import H4 from '../../typography/H4';

function FollowListSearch() {
  return (
    <FollowList
      header={<H4>Followers</H4>}
      followers={[
        {
          id: 'fakeId1',
          request: true,
          firstName: 'Joshua',
          lastName: 'Imel',
          parentChannel: {
            id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
            name: 'NewSpring - Articles',
          },
          image: {
            sources: [
              {
                uri: 'https://picsum.photos/600/400?random',
              },
            ],
          },
        },
      ]}
    />
  );
}

export default FollowListSearch;
