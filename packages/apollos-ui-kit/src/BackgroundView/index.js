import PropTypes from 'prop-types';

import { Dimensions, Platform, View } from 'react-native';

import styled from '../styled';

const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight;

const BackgroundView = styled(
  ({ theme, avoidHeader = false, material = 'screen', flexed = true }) => ({
    backgroundColor:
      theme?.colors?.background[material] || theme?.colors?.background?.screen,
    flex: flexed ? 1 : 0,
    height: flexed ? '100%' : undefined,
    ...(avoidHeader
      ? Platform.OS === 'android'
        ? { paddingTop: navbarHeight + theme.sizing.baseUnit * 2 }
        : {}
      : {}),
  }),
  'ui-kit.BackgroundView'
)(View);

BackgroundView.propTypes = {
  material: PropTypes.string,
  flexed: PropTypes.bool,
  style: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export default BackgroundView;
