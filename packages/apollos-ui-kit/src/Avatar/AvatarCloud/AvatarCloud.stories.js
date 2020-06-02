import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../../CenteredView';

import AvatarCloud from '.';

storiesOf('ui-kit/Avatar/AvatarCloud', module)
  // .addDecorator((story) => (
  //   <CenteredView style={{ alignItems: 'stretch' /* eslint-disable-line */ }}>
  //     {story()}
  //   </CenteredView>
  // ))
  .add('default', () => <AvatarCloud />);
