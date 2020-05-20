import React from 'react';
import { View } from 'react-native';
import { CastButton } from 'react-native-google-cast';

import { styled } from '@apollosproject/ui-kit';

const Wrapper = styled({
  justifyContent: 'center',
  alignItems: 'center',
})(View);

const StyledCastButton = styled(({ theme }) => ({
  width: 40 + theme.sizing.baseUnit * 1.25,
  height: 40 + theme.sizing.baseUnit * 1.25,
  tintColor: theme.colors.paper,
}))(CastButton);

const CastBtn = () => (
  <Wrapper>
    <StyledCastButton />
  </Wrapper>
);

export default CastBtn;
