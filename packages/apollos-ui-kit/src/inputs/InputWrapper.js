import { View } from 'react-native';

import styled from '../styled';

const InputWrapper = styled(
  ({ theme, disabled }) => ({
    marginVertical: theme.sizing.baseUnit,
    ...(disabled ? { opacity: 0.5 } : {}),
  }),
  'ui-kit.inputs.InputWrapper'
)(View);

export default InputWrapper;
