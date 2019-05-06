import React from 'react';
import { storiesOf } from 'ApollosStorybook/native-storybook';



import ErrorCard from '.';

storiesOf('Card/ErrorCard', module).add('Example', () => (
  <ErrorCard message={'Boom!'} error={'What?'} />
));
