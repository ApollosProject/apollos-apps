import { View } from 'react-native';

import styled from '../styled';

const InputAddon = styled(
  {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'InputAddon'
)(View);

const AddonRow = styled(
  {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  'InputWrapper.Row'
)(View);

const TextInputWrapper = styled(
  {
    flex: 1,
    alignSelf: 'flex-end',
  },
  'InputWrapper.TextInput'
)(View);

export { InputAddon as default, AddonRow, TextInputWrapper };
