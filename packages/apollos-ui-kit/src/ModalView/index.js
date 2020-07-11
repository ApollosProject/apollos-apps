import React from 'react';
import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';

import BackgroundView from '../BackgroundView';
import styled from '../styled';

import ModalViewHeader from './ModalViewHeader';

export { ModalCloseButton, ModalBackButton } from './ModalViewHeader';

const Container = styled({
  flex: null,
  width: '100%',
  height: '100%',
  borderRadius: 0,
})(BackgroundView);

const ModalView = ({
  children,
  onClose,
  onBack,
  navigationHeader,
  ...props
}) => {
  const navigation = useNavigation();
  return (
    <Container {...props}>
      {children}
      <ModalViewHeader
        onClose={onClose || navigation.pop}
        onBack={onBack}
        navigationHeader={navigationHeader}
      />
    </Container>
  );
};

ModalView.propTypes = {
  children: PropTypes.any, // eslint-disable-line
  onClose: PropTypes.func,
  onBack: PropTypes.func,
  navigationHeader: PropTypes.any, // eslint-disable-line
};

export { ModalView as default, ModalViewHeader };
