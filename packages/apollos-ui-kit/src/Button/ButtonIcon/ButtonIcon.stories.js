import React from 'react';
import { storiesOf } from '@storybook/react-native';

import ButtonIcon from '.';

storiesOf('Buttons/Icon', module)
  .add('default', () => <ButtonIcon name={'umbrella'} />)
  .add('iconPadding', () => <ButtonIcon name={'umbrella'} iconPadding={50} />)
  .add('disabled', () => <ButtonIcon name={'umbrella'} disabled />)
  .add('isLoading', () => <ButtonIcon name={'umbrella'} disabled isLoading />);
