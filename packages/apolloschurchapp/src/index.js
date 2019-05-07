import React from 'react';
import Providers from './Providers';

import Storybook from './Storybook';

const App = Storybook;
// Swap this line with the one above to render the App instead of Storybook:
// import App from './App';

const RootApp = () => (
  <Providers>
    <App />
  </Providers>
);

export default RootApp;
