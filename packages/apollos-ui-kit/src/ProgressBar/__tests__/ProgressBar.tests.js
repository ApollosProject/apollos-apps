import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import ProgressBar from '..';

describe('ProgressBar', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ProgressBar />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render at 25%', () => {
    const tree = renderer.create(
      <Providers>
        <ProgressBar step={25} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render at 50%', () => {
    const tree = renderer.create(
      <Providers>
        <ProgressBar step={50} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render at 75%', () => {
    const tree = renderer.create(
      <Providers>
        <ProgressBar step={75} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render at 100%', () => {
    const tree = renderer.create(
      <Providers>
        <ProgressBar step={100} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render at 0% when given a negative input', () => {
    const tree = renderer.create(
      <Providers>
        <ProgressBar step={-25} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render at 100% when given an input over 100', () => {
    const tree = renderer.create(
      <Providers>
        <ProgressBar step={250} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
