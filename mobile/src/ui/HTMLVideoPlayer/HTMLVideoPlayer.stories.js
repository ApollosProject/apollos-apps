import React from 'react';
import { storiesOf } from '@storybook/react-native';

import HTMLVideoPlayer from '.';

const wistiaEmbedCode = `<script charset="ISO-8859-1" src="https://fast.wistia.com/assets/external/E-v1.js" async></script>
<div class="wistia_embed wistia_async_g5pnf59ala videoFoam=true" style="width:640px;height:360px;">&nbsp;</div>`;

storiesOf('HTMLVideoPlayer', module).add('Wistia Embed', () => (
  <HTMLVideoPlayer source={wistiaEmbedCode} />
));
