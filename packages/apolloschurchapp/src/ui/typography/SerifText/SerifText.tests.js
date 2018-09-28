import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import SerifText from '.';

describe('the SerifText component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <Providers>
        <SerifText>Default SerifText text</SerifText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as bold', () => {
    const tree = renderer.create(
      <Providers>
        <SerifText bold>Bold SerifText text</SerifText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as italic', () => {
    const tree = renderer.create(
      <Providers>
        <SerifText italic>Italic SerifText text</SerifText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render as bold italic', () => {
    const tree = renderer.create(
      <Providers>
        <SerifText bold italic>
          Bold italic SerifText text
        </SerifText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept and render passed in styles', () => {
    const salmon = { color: 'salmon' };
    const tree = renderer.create(
      <Providers>
        <SerifText style={salmon}>Salmon text</SerifText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <SerifText isLoading>Default SerifText text</SerifText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should accept additional props', () => {
    const tree = renderer.create(
      <Providers>
        <SerifText accessible={false}>
          {
            '"True faith means holding nothing back. It means putting every hope in God\'s fidelity to His Promises." ― Francis Chan'
          }
        </SerifText>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
