import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'Providers';

import HTMLVideoPlayer from '.';

const wistiaEmbedCode = `<script charset="ISO-8859-1" src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
<div class="wistia_embed wistia_async_g5pnf59ala videoFoam=true" style="width:640px;height:360px;">&nbsp;</div>`;

describe('The HTMLVideoPLayer component', () => {
  it('renders a wistia embed', () => {
    const tree = renderer.create(
      <Providers>
        <HTMLVideoPlayer source={wistiaEmbedCode} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
