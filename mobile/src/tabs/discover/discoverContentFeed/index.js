import React from 'react';
import { ScrollView } from 'react-native';

import PaddedView from 'ui/PaddedView';
import TileContentFeed from './tileContentFeed';
import ThumbnailContentFeed from './thumbnailContentFeed';

const DiscoverContentFeed = ({ ...props }) => (
  <ScrollView>
    <PaddedView>
      <TileContentFeed
        contentName={'Sermon Series'}
        displayName={'Sermons'}
        {...props}
      />
      <TileContentFeed
        contentName={'Devotion Series'}
        displayName={'Devotionals'}
        {...props}
      />
      <ThumbnailContentFeed
        contentName={'Editorial'}
        displayName={'Stories'}
        {...props}
      />
    </PaddedView>
  </ScrollView>
);

export default DiscoverContentFeed;
