import { View } from 'react-native';

import styled from '../styled';

const InputAddon = styled(
  {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'ui-kit.inputs.InputAddOn.InputAddon'
)(View);

const AddonRow = styled(
  {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  'ui-kit.inputs.InputAddOn.AddonRow'
)(View);

const TextInputWrapper = styled(
  {
    flex: 1,
    alignSelf: 'flex-end',
  },
  'ui-kit.inputs.InputAddOn.TextInputWrapper'
)(View);

export { InputAddon as default, AddonRow, TextInputWrapper };
