import PropTypes from 'prop-types';

import { View } from 'react-native';

import styled from '../styled';

const BackgroundView = styled(
  ({ theme, material = 'screen', flexed = true }) => ({
    backgroundColor:
      theme?.colors?.background[material] || theme?.colors?.background?.screen,
    flex: flexed ? 1 : 0,
    height: flexed ? '100%' : undefined,
  }),
  'ui-kit.BackgroundView'
)(View);

BackgroundView.propTypes = {
  material: PropTypes.string,
  flexed: PropTypes.bool,
  style: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export default BackgroundView;
