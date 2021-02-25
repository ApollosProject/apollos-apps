import React from 'react';
import PropTypes from 'prop-types';
import { Modal as ModalCore, SafeAreaView } from 'react-native';
import ModalHeader from './ModalHeader';

function Modal({ children, ...props }) {
  return (
    <ModalCore {...props}>
      <SafeAreaView>{children}</SafeAreaView>
    </ModalCore>
  );
}

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

export { Modal as default, ModalHeader };
