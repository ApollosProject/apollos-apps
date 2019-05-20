import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import ModalView from '.';

const navigation = {
  pop: () => {},
};

storiesOf('ui-kit/ModalView', module)
  .add('onBack', () => <ModalView navigation={navigation} onBack={() => {}} />)
  .add('onClose', () => (
    <ModalView navigation={navigation} onClose={() => {}} />
  ))
  .add('navigation', () => <ModalView navigation={navigation} />);
