import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';

import { withIsLoading } from '../isLoading';
import CenteredView from '../CenteredView';

import { H1, H2, H3, H4, H5, H6 } from '.';

const SetLoading = withIsLoading(CenteredView);

storiesOf('ui-kit/typography', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView> // eslint-disable-line react-native/no-inline-styles
  ))
  .add('headings', () => (
    <View>
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>
    </View>
  ))
  .add('headings - padded', () => (
    <View>
      <H1 padded>Heading 1</H1>
      <H2 padded>Heading 2</H2>
      <H3 padded>Heading 3</H3>
      <H4 padded>Heading 4</H4>
      <H5 padded>Heading 5</H5>
      <H6 padded>Heading 6</H6>
    </View>
  ))
  .add('headings – isLoading', () => (
    <SetLoading isLoading>
      <H1>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <H5>Heading 5</H5>
      <H6>Heading 6</H6>
    </SetLoading>
  ));
