import * as React from 'react';
import { View, Text } from 'react-native';
import { styled } from '@apollosproject/ui-kit';

const Container = styled(({ theme }: any) => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  paddingHorizontal: theme?.sizing?.baseUnit,
  paddingBottom: theme?.sizing?.baseUnit,
}))(View);

const LiveText = styled(({ theme }: any) => ({
  color: theme.colors.paper,
}))(Text);

const LiveDot = styled(({ theme }: any) => ({
  color: 'red',
  marginRight: theme.sizing.baseUnit * 0.5,
}))(Text);

export default () => (
  <Container>
    <LiveDot>●</LiveDot>
    <LiveText>Live Broadcast</LiveText>
  </Container>
);
