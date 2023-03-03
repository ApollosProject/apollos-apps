import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { BackgroundView, CenteredView } from '@apollosproject/ui-kit';
import ScriptureFeature from './ScriptureFeature';

const genesis1 = {
  reference: 'Genesis 1:1-5',
  html:
    '<p class="p"><span data-number="1" class="v">1</span>In the beginning, God created the heavens and the earth. <span data-number="2" class="v">2</span>The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters.</p><p class="p"><span data-number="3" class="v">3</span>God said, “Let there be light,” and there was light. <span data-number="4" class="v">4</span>God saw the light, and saw that it was good. God divided the light from the darkness. <span data-number="5" class="v">5</span>God called the light “day”, and the darkness he called “night”. There was evening and there was morning, the first day.</p>',
  isLoading: false,
  copyright: 'PUBLIC DOMAIN',
  version: 'WEB',
};

storiesOf('ui-connected/ScriptureFeature', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('example', () => (
    <ScriptureFeature
      scriptures={[genesis1]}
      title={'Daily Reading'}
      linkText={'Open in Spotify'}
    />
  ))
  .add('isCard=false', () => (
    <ScriptureFeature
      scriptures={[genesis1]}
      title={'Daily Reading'}
      linkText={'Open in Spotify'}
      isCard={false}
    />
  ));
