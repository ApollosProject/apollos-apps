import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView } from '@apollosproject/ui-kit';

import VerticalPrayerListFeature from './VerticalPrayerListFeature';

const prayers = [
  {
    id: '1',
    requestor: {
      firstName: 'Michael',
      photo: {
        uri: 'https://picsum.photos/200',
      },
    },
    text: 'story prayer 1',
  },
  {
    id: '2',
    requestor: {
      firstName: 'Michael',
      photo: {
        uri: 'https://picsum.photos/200',
      },
    },
    text: 'story prayer 2',
  },
];

storiesOf('ui-connected/VerticalPrayerListFeature', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: "stretch" /* eslint-disable-line */ }}>
      {story()}
    </CenteredView>
  ))
  .add('default', () => (
    <VerticalPrayerListFeature
      title="title"
      subtitle="subtitle"
      prayers={prayers}
    />
  ));
