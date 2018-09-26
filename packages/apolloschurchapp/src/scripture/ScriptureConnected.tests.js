import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import getScripture from './getScripture';
import ScriptureConnected from '.';

const mocks = {
  request: {
    query: getScripture,
    variables: { query: 'Genesis 1:1' },
  },
  result: {
    data: {
      scripture: {
        id: 'GEN.1.1',
        reference: 'Genesis 1:1',
        html:
          '<p class="p"><span data-number="1" class="v">1</span>In the beginning, God created the heavens and the earth. </p>',
      },
    },
  },
};

it('renders without error', () => {
  renderer.create(
    <Providers mocks={mocks} addTypename={false}>
      <ScriptureConnected references="[Genesis 1:1]" />
    </Providers>
  );
});
