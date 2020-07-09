import React from 'react';
import { withNavigation } from 'react-navigation';

import BackgroundView from '../BackgroundView';
import styled from '../styled';

import ModalViewHeader from './ModalViewHeader';

const Container = styled(
  {
    flex: null,
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  'ui-kit.ModalView.Container'
)(BackgroundView);

const ModalView = withNavigation(
  ({ children, onClose, onBack, navigation, navigationHeader, ...props }) => (
    <Container {...props}>
      {children}
      <ModalViewHeader
        onClose={onClose || navigation.pop}
        onBack={onBack}
        navigationHeader={navigationHeader}
      />
    </Container>
  )
);

export { ModalView as default, ModalViewHeader };
