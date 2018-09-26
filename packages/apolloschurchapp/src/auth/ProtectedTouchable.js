import React from 'react';
import PropTypes from 'prop-types';
import Touchable from 'apolloschurchapp/src/ui/Touchable';
import ProtectedAction from './ProtectedAction';

const ProtectedTouchable = ({ onPress, children }) => (
  <ProtectedAction>
    {(protect) => <Touchable onPress={protect(onPress)}>{children}</Touchable>}
  </ProtectedAction>
);

ProtectedTouchable.propTypes = {
  onPress: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ProtectedTouchable;
