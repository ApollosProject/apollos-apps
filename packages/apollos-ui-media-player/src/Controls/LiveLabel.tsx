import * as React from 'react';
import { View, Text } from 'react-native';
import { styled } from '@apollosproject/ui-kit';

const Container = styled(({ theme }: any) => ({
  width: '100%',
  alignItems: 'center',
  paddingHorizontal: theme?.sizing?.baseUnit,
  paddingBottom: theme?.sizing?.baseUnit,
}))(View);

export default () => (
  <Container>
    <Text style={{ color: 'white' }}>
      <Text style={{ color: 'red' }}>●</Text> Live Broadcast
    </Text>
  </Container>
);
