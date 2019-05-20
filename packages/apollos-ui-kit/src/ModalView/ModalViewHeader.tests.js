import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import ModalViewHeader from './ModalViewHeader';

describe('The ModalView/ModalViewHeader component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ModalViewHeader onBack={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept an onClose function', () => {
    const tree = renderer.create(
      <Providers>
        <ModalViewHeader onClose={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept an onBack function', () => {
    const tree = renderer.create(
      <Providers>
        <ModalViewHeader onBack={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as a navigationHeader', () => {
    const tree = renderer.create(
      <Providers>
        <ModalViewHeader
          onBack={jest.fn()}
          onClose={jest.fn()}
          navigationHeader
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
