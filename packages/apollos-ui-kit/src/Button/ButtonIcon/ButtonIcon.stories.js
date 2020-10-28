import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../../CenteredView';
import ButtonIcon from '.';

storiesOf('ui-kit/Buttons/Icon', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView> // eslint-disable-line
  ))
  .add('default', () => <ButtonIcon name={'umbrella'} />)
  .add('custom icon', () => <ButtonIcon name={'custom'} />)
  .add('iconPadding', () => <ButtonIcon name={'umbrella'} iconPadding={50} />)
  .add('disabled', () => <ButtonIcon name={'umbrella'} disabled />)
  .add('isLoading', () => <ButtonIcon name={'umbrella'} disabled isLoading />)
  .add('additional styles', () => (
    <ButtonIcon name={'umbrella'} style={{ backgroundColor: 'salmon' }} /> // eslint-disable-line
  ));
