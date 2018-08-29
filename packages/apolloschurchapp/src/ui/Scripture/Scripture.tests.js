import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'apolloschurchapp/src/Providers';
import Item from './Item';

const songOfSolomon1 = {
  scripture: {
    query: 'Song of Solomon 1:1-4',
    html:
      '<div id="v22001000-22001004" class="basic eng esv passage text" reference="Song of Solomon 1:1–4" start="22001000" end="22001004"><p id="p22001001_01-1" class="starts-chapter"><b class="chapter-num" id="v22001001-1">1:1&nbsp;</b>The Song of Songs, which is Solomon\'s.</p>\n<p class="block-indent"><h4 id="p22001001_06-1" class="speaker">She</h4>\n<span class="begin-line-group"></span>\n<span id="p22001002_06-1" class="line"><b class="verse-num inline" id="v22001002-1">2&nbsp;</b>&nbsp;&nbsp;Let him kiss me with the kisses of his mouth!</span><br /><span id="p22001002_06-1" class="line">&nbsp;&nbsp;For your love is better than wine;</span><br /><span id="p22001003_06-1" class="indent line"><b class="verse-num inline" id="v22001003-1">3&nbsp;</b>&nbsp;&nbsp;&nbsp;&nbsp;your anointing oils are fragrant;</span><br /><span id="p22001003_06-1" class="line">&nbsp;&nbsp;your name is oil poured out;</span><br /><span id="p22001003_06-1" class="indent line">&nbsp;&nbsp;&nbsp;&nbsp;therefore virgins love you.</span><br /><span id="p22001004_06-1" class="line"><b class="verse-num inline" id="v22001004-1">4&nbsp;</b>&nbsp;&nbsp;Draw me after you; let us run.</span><br /><span id="p22001004_06-1" class="indent line">&nbsp;&nbsp;&nbsp;&nbsp;The king has brought me into his chambers.</span><br /><span class="end-line-group"></span>\n<h4 id="p22001004_06-1" class="speaker">Others</h4>\n<span class="begin-line-group"></span>\n<span id="p22001004_06-1" class="line">&nbsp;&nbsp;We will exult and rejoice in you;</span><br /><span id="p22001004_06-1" class="indent line">&nbsp;&nbsp;&nbsp;&nbsp;we will extol your love more than wine;</span><br /><span id="p22001004_06-1" class="indent line">&nbsp;&nbsp;&nbsp;&nbsp;rightly do they love you.</span><br /></p><span class="end-line-group"></span>\n</div>',
  },
};

const john = {
  scripture: {
    query: 'John 11:35-36',
    html:
      '<p id="p43011035_01-1" class="virtual"><b class="verse-num" id="v43011035-1">35&nbsp;</b>Jesus wept. <b class="verse-num" id="v43011036-1">36&nbsp;</b>So the Jews said, “See how he loved him!”</p>\n',
  },
};

describe('the ScriptureItem component', () => {
  it('renders Song of Solomon 1:1-4', () => {
    const tree = renderer.create(
      <Providers>
        <Item
          query={songOfSolomon1.scripture.query}
          html={songOfSolomon1.scripture.html}
          isLoading={false}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders John 11:35-36', () => {
    const tree = renderer.create(
      <Providers>
        <Item
          query={john.scripture.query}
          html={john.scripture.html}
          isLoading={false}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
