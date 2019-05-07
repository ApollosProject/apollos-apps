import renderer from 'react-test-renderer';
import React from 'react';

import App from './App';
import Providers from './Providers';

it('renders without crashing', () => {
  const rendered = renderer
    .create(
      <Providers>
        <App />
      </Providers>
    )
    .toJSON();
  expect(rendered).toBeTruthy();
});
