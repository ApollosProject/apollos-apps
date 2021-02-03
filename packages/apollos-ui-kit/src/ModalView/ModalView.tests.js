import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';

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
  it('should render with children', () => {
    const tree = renderer.create(
      <Providers>
        <ModalView navigation={navigation}>
          <Text>{'"Roads? Where we going we don’t need roads." – Doc'}</Text>
        </ModalView>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom close action', () => {
    const tree = renderer.create(
      <Providers>
        <ModalView navigation={navigation} onClose={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
