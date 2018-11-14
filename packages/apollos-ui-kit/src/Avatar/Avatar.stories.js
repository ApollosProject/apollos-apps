import React from 'react';
import { storiesOf } from '@storybook/react-native';

import FlexedView from '../FlexedView';

import Avatar from '.';

const source = {
  uri:
    'https://dg0ddngxdz549.cloudfront.net/images/cached/images/remote/http_s3.amazonaws.com/ns.images/all/member_images/members.nophoto_1000_1000_90_c1.jpg',
};
/* eslint-disable react-native/no-inline-styles */
storiesOf('Avatar', module).add('default', () => (
  <FlexedView style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
    <Avatar source={source} size="small" />
    <Avatar source={source} size="medium" />
    <Avatar source={source} size="large" />
  </FlexedView>
));
