import React from 'react';
import { withNavigation } from 'react-navigation';

import BackgroundView from '../BackgroundView';
import styled from '../styled';

import ModalViewHeader from './ModalViewHeader';

const Container = styled({
  flex: null,
  width: '100%',
  height: '100%',
  borderRadius: 0,
})(BackgroundView);

const ModalView = withNavigation(
  ({ navigation, onBack, children, ...props }) => (
    <Container {...props}>
      {children}
      <ModalViewHeader onClose={() => (onBack ? onBack() : navigation.pop())} />
    </Container>
  )
);

export { ModalView as default, ModalViewHeader };
