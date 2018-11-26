import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import ModalViewHeader from './ModalViewHeader';

describe('The ModalView/ModalViewHeader component', () => {
  it('should render a back button', () => {
    const tree = renderer.create(
      <Providers>
        <ModalViewHeader onBack={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a close button', () => {
    const tree = renderer.create(
      <Providers>
        <ModalViewHeader onClose={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render both buttons', () => {
    const tree = renderer.create(
      <Providers>
        <ModalViewHeader onBack={jest.fn()} onClose={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
