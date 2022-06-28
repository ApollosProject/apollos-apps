import { View, StyleSheet } from 'react-native';

import styled from '../styled';

const Divider = styled(
  ({ theme }) => ({
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.shadows.default,
    marginLeft: theme.sizing.baseUnit,
  }),
  'ui-kit.TableView.Divider'
)(View);

export default Divider;
