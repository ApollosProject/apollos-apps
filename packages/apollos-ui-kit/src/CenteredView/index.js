import PropTypes from 'prop-types';
import { View } from 'react-native';

import styled from '../styled';

const CenteredView = styled(
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  'ui-kit.CenteredView.CenteredView'
)(View);

CenteredView.defaultProps = {
  children: null,
};

CenteredView.propTypes = {
  children: PropTypes.node,
};

export default CenteredView;
