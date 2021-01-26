import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView } from '@apollosproject/ui-kit';

import UserPrayersFeature from './UserPrayersFeature';

const prayers = [
  {
    id: '1',
  },
  {
    id: '2',
  },
  {
    id: '3',
  },
  {
    id: '4',
  },
  {
    id: '5',
  },
];

storiesOf('ui-connected/UserPrayersFeature', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: "stretch" /* eslint-disable-line */ }}>
      {story()}
    </CenteredView>
  ))
  .add('default', () => (
    <UserPrayersFeature
      title="Pray for Michael"
      subtitle="test prayer 1..."
      avatar={{ uri: 'https://picsum.photos/200' }}
      prayers={prayers}
    />
  ));
