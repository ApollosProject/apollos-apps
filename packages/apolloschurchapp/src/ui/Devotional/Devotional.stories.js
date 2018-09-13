import React from 'react';
import { ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import TabView, { SceneMap } from 'apolloschurchapp/src/ui/TabView';
import { H2, H6 } from 'apolloschurchapp/src/ui/typography';

const songOfSolomon1 = {
  scripture: {
    reference: 'Song of Solomon 1:1-4',
    html:
      '<p class="p"><span data-number="1" class="v">1</span>The Song of songs, which is Solomon’s.</p><p class="sp">Beloved</p><p class="q1"><span data-number="2" class="v">2</span>Let him kiss me with the kisses of his mouth;</p><p class="q2">for your love is better than wine.</p><p class="q1"><span data-number="3" class="v">3</span>Your oils have a pleasing fragrance.</p><p class="q2">Your name is oil poured out,</p><p class="q2">therefore the virgins love you.</p><p class="q1"><span data-number="4" class="v">4</span>Take me away with you.</p><p class="q2">Let’s hurry.</p><p class="q2">The king has brought me into his rooms.</p><p class="sp">Friends</p><p class="q1">We will be glad and rejoice in you.</p><p class="q2">We will praise your love more than wine!</p><p class="sp">Beloved</p><p class="q1">They are right to love you.</p>',
    title: 'Do You and God Share the Same View of Sex?',
    text:
      '<p>For many of us, the heat between Solomon and his wife feels like a fairy tale. We&rsquo;ve grown up in a world that tells us sex is dirty and evil, or that sex is just a physical exchange. We either avoid the topic out of fear, or we talk about sex like it&#39;s a normal part of growing up,&nbsp;no different than going through puberty or getting a driver&#39;s license.&nbsp;&nbsp;</p><p>But both points of view &mdash; sex is bad and sex is no big deal &mdash; are wrong. Sex is good, and sex is special. Sex was created by God as a gift for men and women to enjoy in marriage. In Song of Solomon, King Solomon&rsquo;s wife describes loving her husband as more delightful than wine. There&rsquo;s no fear or judgment between them, just awe and praise for the spiritual and physical bond they share.</p><blockquote><p>God&rsquo;s plan for sex is better than our own.</p></blockquote><p>God&rsquo;s plan for sex is better than our own. He is a good God who wants good things for us, sex included. Seeing sex as anything less is to take what God has made sacred and treat it as something common.</p><p>Treating sex as a physical exchange never satisfies because it lacks the spiritual bond God creates in marriage. And treating sex as dirty denies married couples the full sensory experience God wants us to have. In both cases, we&rsquo;re settling for sex that&rsquo;s less than God&rsquo;s best.</p><p>Changing our views on sex increases our enjoyment of sex. When we approach sex with God&rsquo;s view, we can experience the fullness, freedom, and fun we see in Song of Solomon.</p><p>Reflect:</p><ul><li>What&rsquo;s been the biggest influence on the way you see sex?</li><li>What&rsquo;s one way God&rsquo;s view of sex and our culture&rsquo;s view of sex are different?</li><li>Is there anything you need to stop doing (or start doing) based on your understanding that sex is both good and sacred?</li></ul>',
    loading: false,
  },
};

const devotionalTab = () => <H6>DevotionalTab</H6>;
const scriptureTab = () => <H6>Scripture Tab</H6>;

const stories = storiesOf('Devotional', module);

// <Item
//   reference={songOfSolomon1.scripture.reference}
//   html={songOfSolomon1.scripture.html}
//   isLoading={false}
// />

stories.add('Song of Solomon 1:1-4', () => (
  <ScrollView>
    <PaddedView>
      <TabView
        routes={[
          { key: 'devotional', title: 'Devotional' },
          { key: 'scripture', title: 'Scripture' },
        ]}
        renderScene={SceneMap({
          first: devotionalTab,
          second: scriptureTab,
        })}
      />
      <H2
        padded
        isLoading={
          !songOfSolomon1.scripture.title && songOfSolomon1.scripture.loading
        }
      >
        {songOfSolomon1.scripture.title}
      </H2>
    </PaddedView>
  </ScrollView>
));