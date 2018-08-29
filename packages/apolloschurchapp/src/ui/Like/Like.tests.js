import React from 'react';
import renderer from 'react-test-renderer';

import { ThemeProvider } from 'apolloschurchapp/src/ui/theme';

import Like from '.';

describe('the Share component', () => {
  it('should render', () => {
    const sessionId = 'adsfasdfasdfasdf';
    const tree = renderer.create(
      <ThemeProvider>
        <Like id={sessionId} />
      </ThemeProvider>
    );
    expect(tree).toMatchSnapshot();
  });
});
