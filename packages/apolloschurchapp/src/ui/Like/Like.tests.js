import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'apolloschurchapp/src/ui/theme';

import Like from '.';

describe('the Share component', () => {
  it('should render a Like', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <Like
          itemId={'abc'}
          sessionId={'123'}
          isLiked={false}
          operation={'Like'}
          toggleLike={(data) => data}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });

  it('should render a UnLike', () => {
    const tree = renderer.create(
      <ThemeProvider>
        <Like
          itemId={'abc'}
          sessionId={'123'}
          isLiked
          operation={'Unlike'}
          toggleLike={(data) => data}
        />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
