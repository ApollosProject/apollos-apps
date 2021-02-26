import React from 'react';
import PropTypes from 'prop-types';
import { Modal as ModalCore, SafeAreaView } from 'react-native';
import BackgroundView from '../BackgroundView';
import ModalHeader from './ModalHeader';

function Modal({ children, ...props }) {
  return (
    <ModalCore {...props}>
      <BackgroundView>
        <SafeAreaView>{children}</SafeAreaView>
      </BackgroundView>
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
