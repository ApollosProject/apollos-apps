import React from 'react';
import { storiesOf } from '@storybook/react-native';

import ActionItem from './ActionItem';

const item = {
  id: 'UniversalContentItem:9d06423a8908b7cc1e1f2db6156c1bfb',
  title: 'Hello 1',
  parentChannel: {
    id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
    name: 'NewSpring - Articles',
  },
  coverImage: {
    sources: {
      uri: 'https://picsum.photos/600/400/?image=63',
    },
  },
};

storiesOf('ActionItem', module).add('Example', () => (
  <ActionItem
    onPress={() => {}}
    imageSource={item.coverImage.sources}
    label={item.parentChannel.name}
    title={item.title}
    id={item.id}
  />
));
