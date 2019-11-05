import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import LoginForm from './Form';

storiesOf('ui-auth', module).add('LoginForm', () => (
  <LoginForm
    values={{ email: '', password: '' }}
    touched={{ email: false, password: false }}
    errors={{ email: null, password: null }}
    handleForgotPassword={() => null}
  />
));
