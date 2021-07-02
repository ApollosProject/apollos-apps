import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';
import SocialBar from './SocialBar';

storiesOf('ui-kit/SocialBar', module)
  .addDecorator((story) => <CenteredView>{story()}</CenteredView>)
  .add('default', () => (
    <SocialBar onPressLike={() => {}} onPressShare={() => {}} isLiked />
  ));
