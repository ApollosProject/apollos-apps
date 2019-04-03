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
  it('should render without an underline', () => {
    const tree = renderer.create(
      <Providers>
        <Radio>
          <RadioButton label="option 1" value="one" underline={false} />
          <RadioButton label="option 2" value="two" underline={false} />
        </Radio>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render horizontally', () => {
    const tree = renderer.create(
      <Providers>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Radio label="Choices" style={{ flexDirection: 'row' }}>
          <RadioButton label="option 1" value="one" underline={false} />
          <RadioButton label="option 2" value="two" underline={false} />
        </Radio>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
