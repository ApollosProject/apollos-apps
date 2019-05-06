import React from 'react';
import { storiesOf } from 'ApollosStorybook/native-storybook';

import LoginForm from './Form';

storiesOf('Auth/SignupForm', module).add('Example', () => (
  <LoginForm
    values={{ email: '', password: '' }}
    touched={{ email: false, password: false }}
    errors={{ email: null, password: null }}
  />
));
