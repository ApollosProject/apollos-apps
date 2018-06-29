import React from 'react';
import { ScrollView } from 'react-native';

import PaddedView from 'ui/PaddedView';
import IndividualContentFeed from './individualContentFeed';

const DiscoverContentFeed = ({ ...props }) => (
  <ScrollView>
    <PaddedView>
      <IndividualContentFeed
        contentName={'Sermon Series'}
        displayName={'Sermons'}
        {...props}
      />
      <IndividualContentFeed
        contentName={'Devotion Series'}
        displayName={'Devotionals'}
        {...props}
      />
      <IndividualContentFeed
        contentName={'Editorial'}
        displayName={'Stories'}
        {...props}
      />
    </PaddedView>
  </ScrollView>
);

export default DiscoverContentFeed;
