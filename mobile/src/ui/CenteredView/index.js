import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from 'ui/styled';

const CenteredView = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.colors.background.default,
}))(View);

CenteredView.defaultProps = {
  children: null,
};

CenteredView.propTypes = {
  children: PropTypes.node,
};

export default CenteredView;