import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import ButtonIcon from '.';

describe('The ButtonIcon component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ButtonIcon name={'umbrella'} onPress={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with custom padding', () => {
    const tree = renderer.create(
      <Providers>
        <ButtonIcon name={'umbrella'} onPress={jest.fn()} iconPadding={50} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render disabled', () => {
    const tree = renderer.create(
      <Providers>
        <ButtonIcon name={'umbrella'} onPress={jest.fn()} disabled />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
