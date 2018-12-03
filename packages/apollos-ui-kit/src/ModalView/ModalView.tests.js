import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';

import ModalView from '.';

const navigation = {
  pop: jest.fn(),
};

describe('The ModalView component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ModalView navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom back action', () => {
    const tree = renderer.create(
      <Providers>
        <ModalView navigation={navigation} onBack={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
