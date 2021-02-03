import * as React from 'react';
import { View } from 'react-native';
import { styled, H6 } from '@apollosproject/ui-kit';

const Container = styled(({ theme }: any) => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'row',
  paddingHorizontal: theme?.sizing?.baseUnit,
  paddingBottom: theme?.sizing?.baseUnit,
}))(View);

const LiveText = styled(({ theme }: any) => ({
  color: theme.colors.text.secondary,
}))(H6);

const LiveDot = styled(({ theme }: any) => ({
  color: theme.colors.alert,
  marginRight: theme.sizing.baseUnit * 0.5,
}))(H6);

export default () => (
  <Container>
    <LiveDot>●</LiveDot>
    <LiveText>Live Broadcast</LiveText>
  </Container>
);
