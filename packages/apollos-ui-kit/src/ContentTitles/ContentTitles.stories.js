import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';
import ContentTitles from './ContentTitles';

storiesOf('ui-kit/ContentTitles', module)
  .addDecorator((story) => <CenteredView>{story()}</CenteredView>)
  .add('default', () => (
    <ContentTitles
      title={'This is a large title'}
      summary={'This is a short summary of this content.'}
    />
  ))
  .add('social buttons', () => (
    <ContentTitles
      title={'This is a large title'}
      summary={'This is a short summary of this content.'}
      onPressLike={() => {}}
      onPressShare={() => {}}
    />
  ))
  .add('featured', () => (
    <ContentTitles
      title={'This is a large title'}
      summary={'This is a short summary of this content.'}
      featured
      onPressLike={() => {}}
      onPressShare={() => {}}
    />
  ))
  .add('micro', () => (
    <ContentTitles
      title={'This is a large title'}
      summary={'This is a short summary of this content.'}
      micro
    />
  ))
  .add('loading', () => <ContentTitles isLoading />);
