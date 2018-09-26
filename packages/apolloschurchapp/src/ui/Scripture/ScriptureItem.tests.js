import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';

import ScriptureItem from './ScriptureItem';

const songOfSolomon1 = {
  scripture: {
    reference: 'Song of Solomon 1:1-4',
    html:
      '<p class="p"><span data-number="1" class="v">1</span>The Song of songs, which is Solomon’s.</p><p class="sp">Beloved</p><p class="q1"><span data-number="2" class="v">2</span>Let him kiss me with the kisses of his mouth;</p><p class="q2">for your love is better than wine.</p><p class="q1"><span data-number="3" class="v">3</span>Your oils have a pleasing fragrance.</p><p class="q2">Your name is oil poured out,</p><p class="q2">therefore the virgins love you.</p><p class="q1"><span data-number="4" class="v">4</span>Take me away with you.</p><p class="q2">Let’s hurry.</p><p class="q2">The king has brought me into his rooms.</p><p class="sp">Friends</p><p class="q1">We will be glad and rejoice in you.</p><p class="q2">We will praise your love more than wine!</p><p class="sp">Beloved</p><p class="q1">They are right to love you.</p>',
    isLoading: false,
  },
};

const john3 = {
  scripture: {
    reference: 'John 3:16-17',
    html:
      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life. </span><span data-number="17" class="v">17</span><span class="wj">For God didn’t send his Son into the world to judge the world, but that the world should be saved through him. </span></p>',
    isLoading: false,
  },
};

const john3Loading = {
  scripture: {
    reference: 'John 3:16-17',
    html:
      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life. </span><span data-number="17" class="v">17</span><span class="wj">For God didn’t send his Son into the world to judge the world, but that the world should be saved through him. </span></p>',
    isLoading: true,
  },
};

describe('the ScriptureItem component', () => {
  it('renders Song of Solomon 1:1-4', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureItem
          reference={songOfSolomon1.scripture.reference}
          html={songOfSolomon1.scripture.html}
          isLoading={songOfSolomon1.scripture.isLoading}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders John 3:16-17', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureItem
          reference={john3.scripture.reference}
          html={john3.scripture.html}
          isLoading={john3.scripture.isLoading}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <ScriptureItem
          reference={john3Loading.scripture.reference}
          html={john3Loading.scripture.html}
          isLoading={john3Loading.scripture.isLoading}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
