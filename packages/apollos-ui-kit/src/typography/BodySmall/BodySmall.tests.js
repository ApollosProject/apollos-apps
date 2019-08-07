import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';

import BodySmall from '.';

describe('the BodySmall component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <BodySmall>Default BodySmall text</BodySmall>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as bold', () => {
    const tree = renderer.create(
      <Providers>
        <BodySmall bold>Bold BodySmall text</BodySmall>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as italic', () => {
    const tree = renderer.create(
      <Providers>
        <BodySmall italic>Italic BodySmall text</BodySmall>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as bold italic', () => {
    const tree = renderer.create(
      <Providers>
        <BodySmall bold italic>
          Bold italic BodySmall text
        </BodySmall>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept and render passed in styles', () => {
    const salmon = { color: 'salmon' };
    const tree = renderer.create(
      <Providers>
        <BodySmall style={salmon}>Smaller salmon text</BodySmall>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <BodySmall isLoading>Default BodySmall text</BodySmall>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept additional props', () => {
    const tree = renderer.create(
      <Providers>
        <BodySmall accessible={false}>
          {
            '"He who lays up treasures on earth spends his life backing away from his treasures. To him, death is loss. He who lays up treasures in heaven looks forward to eternity; he’s moving daily toward his treasures. To him, death is gain." ― Randy Alcorn'
          }
        </BodySmall>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
