import React from 'react';
import { storiesOf } from '@storybook/react-native';

import ActionTable from '.';

const content = [
  {
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
  },
  {
    id: 'UniversalContentItem:9d06423a8908b7cc1e1f2db6156c1bfb',
    title: 'Hello 2',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400/?image=63',
      },
    },
  },
  {
    id: 'UniversalContentItem:9d06423a8908b7cc1e1f2db6156c1bfb',
    title: 'Hello 3',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400/?image=63',
      },
    },
  },
  {
    id: 'UniversalContentItem:9d06423a8908b7cc1e1f2db6156c1bfb',
    title: 'Hello 4',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400/?image=63',
      },
    },
  },
];

// TODO: Update actionTable story once ActionTable component is update
storiesOf('ActionTable', module)
  .add('Example', () => (
    <ActionTable
      label={'FOR YOU'}
      title={'Some random text that encourages you'}
      isLoading={false}
      onPress={() => {}}
      content={content}
    />
  ))
  .add('Loading', () => (
    <ActionTable
      label={'FOR YOU'}
      title={'Some random text that encourages you'}
      isLoading
      onPress={() => {}}
      content={content}
    />
  ));
