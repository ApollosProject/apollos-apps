import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import ButtonIcon from '.';

storiesOf('ui-kit/Buttons/Icon', module)
  .add('default', () => <ButtonIcon name={'umbrella'} />)
  .add('iconPadding', () => <ButtonIcon name={'umbrella'} iconPadding={50} />)
  .add('disabled', () => <ButtonIcon name={'umbrella'} disabled />)
  .add('isLoading', () => <ButtonIcon name={'umbrella'} disabled isLoading />)
  .add('additional styles', () => (
    <ButtonIcon name={'umbrella'} style={{ backgroundColor: 'salmon' }} /> // eslint-disable-line
  ));
