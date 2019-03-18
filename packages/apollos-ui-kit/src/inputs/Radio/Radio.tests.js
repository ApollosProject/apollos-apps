import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import Radio, { RadioButton } from '.';

describe('The Radio component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <Radio label="Choices">
          <RadioButton label="option 1" value="one" />
          <RadioButton label="option 2" value="two" />
        </Radio>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
