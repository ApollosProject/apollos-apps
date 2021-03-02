import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

import Providers from '../Providers';
import ModalHeader from './ModalHeader';
import Modal from '.';

describe('The Modal component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <Modal />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with children', () => {
    const tree = renderer.create(
      <Providers>
        <Modal>
          <Text>{'"Roads? Where we going we don’t need roads." – Doc'}</Text>
        </Modal>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom close action', () => {
    const tree = renderer.create(
      <Providers>
        <Modal>
          <ModalHeader onNext={jest.fn()} />
        </Modal>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
