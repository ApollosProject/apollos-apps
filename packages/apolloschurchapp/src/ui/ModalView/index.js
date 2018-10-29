import React from 'react';
import { withNavigation } from 'react-navigation';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import styled from 'apolloschurchapp/src/ui/styled';

import ModalViewHeader from './ModalViewHeader';

export { ModalViewHeader };

const Container = styled({
  flex: null,
  width: '100%',
  height: '100%',
  borderRadius: 0,
})(BackgroundView);

const ModalView = ({ navigation, onBack, children, ...props }) => (
  <Container {...props}>
    {children}
    <ModalViewHeader onClose={() => (onBack ? onBack() : navigation.pop())} />
  </Container>
);

export default withNavigation(ModalView);
