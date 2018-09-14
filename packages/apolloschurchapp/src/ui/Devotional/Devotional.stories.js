import React from 'react';
import { ScrollView } from 'react-native';
import { withProps } from 'recompose';
import { storiesOf } from '@storybook/react-native';
import BackgroundView from 'apolloschurchapp/src/ui/BackgroundView';
import PaddedView from 'apolloschurchapp/src/ui/PaddedView';
import TabView, { SceneMap } from 'apolloschurchapp/src/ui/TabView';
import { H2, H4, H6 } from 'apolloschurchapp/src/ui/typography';
import styled from 'apolloschurchapp/src/ui/styled';
import HTMLView from 'apolloschurchapp/src/ui/HTMLView';
import scriptures from 'apolloschurchapp/src/utils/scriptures';

import DevotionalTab from './DevotionalTab';

const ContentContainer = styled({ paddingVertical: 0 })(PaddedView);

const ScriptureLink = styled(({ theme }) => ({
  color: theme.colors.primary,
  textAlign: 'center',
  textDecorationLine: 'underline',
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(H4);

const songOfSolomon1 = {
  scripture: {
    reference: 'Song of Solomon 1:1-4',
    html:
      '<p class="p"><span data-number="1" class="v">1</span>The Song of songs, which is Solomon’s.</p><p class="sp">Beloved</p><p class="q1"><span data-number="2" class="v">2</span>Let him kiss me with the kisses of his mouth;</p><p class="q2">for your love is better than wine.</p><p class="q1"><span data-number="3" class="v">3</span>Your oils have a pleasing fragrance.</p><p class="q2">Your name is oil poured out,</p><p class="q2">therefore the virgins love you.</p><p class="q1"><span data-number="4" class="v">4</span>Take me away with you.</p><p class="q2">Let’s hurry.</p><p class="q2">The king has brought me into his rooms.</p><p class="sp">Friends</p><p class="q1">We will be glad and rejoice in you.</p><p class="q2">We will praise your love more than wine!</p><p class="sp">Beloved</p><p class="q1">They are right to love you.</p>',
  },
  devotional: {
    text:
      '<p>For many of us, the heat between Solomon and his wife feels like a fairy tale. We&rsquo;ve grown up in a world that tells us sex is dirty and evil, or that sex is just a physical exchange. We either avoid the topic out of fear, or we talk about sex like it&#39;s a normal part of growing up,&nbsp;no different than going through puberty or getting a driver&#39;s license.&nbsp;&nbsp;</p><p>But both points of view &mdash; sex is bad and sex is no big deal &mdash; are wrong. Sex is good, and sex is special. Sex was created by God as a gift for men and women to enjoy in marriage. In Song of Solomon, King Solomon&rsquo;s wife describes loving her husband as more delightful than wine. There&rsquo;s no fear or judgment between them, just awe and praise for the spiritual and physical bond they share.</p><blockquote><p>God&rsquo;s plan for sex is better than our own.</p></blockquote><p>God&rsquo;s plan for sex is better than our own. He is a good God who wants good things for us, sex included. Seeing sex as anything less is to take what God has made sacred and treat it as something common.</p><p>Treating sex as a physical exchange never satisfies because it lacks the spiritual bond God creates in marriage. And treating sex as dirty denies married couples the full sensory experience God wants us to have. In both cases, we&rsquo;re settling for sex that&rsquo;s less than God&rsquo;s best.</p><p>Changing our views on sex increases our enjoyment of sex. When we approach sex with God&rsquo;s view, we can experience the fullness, freedom, and fun we see in Song of Solomon.</p><p>Reflect:</p><ul><li>What&rsquo;s been the biggest influence on the way you see sex?</li><li>What&rsquo;s one way God&rsquo;s view of sex and our culture&rsquo;s view of sex are different?</li><li>Is there anything you need to stop doing (or start doing) based on your understanding that sex is both good and sacred?</li></ul>',
  },
  loading: false,
};

const scriptureTab = () => <H6>Scripture Tab</H6>;
const title = 'God is Our Banner';
const scripture = [
  {
    "reference": "1 Corinthians 15:57",
    "content": "<p class=\"p\"><span data-number=\"57\" class=\"v\">57</span>But thanks be to God, who gives us the victory through our Lord Jesus Christ. </p>",
  },
  {
    "reference": "Exodus 17:8-15",
    "content": "<p class=\"p\"><span data-number=\"8\" class=\"v\">8</span>Then Amalek came and fought with Israel in Rephidim. <span data-number=\"9\" class=\"v\">9</span>Moses said to Joshua, “Choose men for us, and go out to fight with Amalek. Tomorrow I will stand on the top of the hill with God’s rod in my hand.” <span data-number=\"10\" class=\"v\">10</span>So Joshua did as Moses had told him, and fought with Amalek; and Moses, Aaron, and Hur went up to the top of the hill. <span data-number=\"11\" class=\"v\">11</span>When Moses held up his hand, Israel prevailed. When he let down his hand, Amalek prevailed. <span data-number=\"12\" class=\"v\">12</span>But Moses’ hands were heavy; so they took a stone, and put it under him, and he sat on it. Aaron and Hur held up his hands, the one on the one side, and the other on the other side. His hands were steady until sunset. <span data-number=\"13\" class=\"v\">13</span>Joshua defeated Amalek and his people with the edge of the sword. <span data-number=\"14\" class=\"v\">14</span>Yahweh said to Moses, “Write this for a memorial in a book, and rehearse it in the ears of Joshua: that I will utterly blot out the memory of Amalek from under the sky.” <span data-number=\"15\" class=\"v\">15</span>Moses built an altar, and called its name “Yahweh our Banner”.</p>",
  }
]

const body = '<p>Sometimes God&rsquo;s promises to us involve a fight. We have to fight to keep our focus on Him, fight to move towards the promise we know God has laid on our hearts. We have a real enemy that would love nothing more than to get us sidetracked and doubt God&rsquo;s promises. So we fight saying that we are going to believe God will do what He says He will do, and we keep fighting until we see that promise come to life.</p><p>In Exodus 17:8-15 the nation of Israel, freed from great oppression in Egypt was traveling to the land God promised them. Yet, Israel was fighting, again.&nbsp;<br />&nbsp;<br />As the Israelites were fighting in the valley,&nbsp;Moses was on the hill top lifting his hands in prayer for these great fighters. Israel fought hard, and with the prayers of Moses and the help of his companions, Aaron and Hur, the Amalekites were defeated. Moses knew that it was solely because of the Lord&rsquo;s hand of protection and blessing on the Israelites that they won the battle. &ldquo;Moses built an altar and called it The Lord is my banner&rdquo; (Exodus 17:15).</p><p>In battle opposing nations would fly their own flag on a pole at each of their respective front lines. This was to give their soldiers a feeling of hope and a focal point. This is what God is to us: a banner of encouragement to give us hope and a focal point.</p><blockquote><p>The Lord protects us, covers us with love, and&nbsp;blesses us continually.</p></blockquote><p>The Lord is our banner. He protects us; He covers us with love; He blesses us continually. The Lord gives us hope and a place to focus during the tough fights when the enemy is trying to make us doubt God&rsquo;s promises.&nbsp;</p><p>When was the last time you sat and thanked Jesus for all the ways he is a banner in your life?&nbsp;</p><p>Reflect:</p><ul><li>What is one way the Lord has been your banner?</li><li>How can you focus more today on the Lord and all the things He does for you throughout the day?</li></ul>';

const stories = storiesOf('Devotional', module);

stories.add('God is Our Banner', () => (
  <ScrollView>
    <PaddedView>
      <TabView
        routes={[
          { key: 'devotional', title: 'Devotional' },
          { key: 'scripture', title: 'Scripture' },
        ]}
        renderScene={SceneMap({
          devotional: withProps({
            body,
            scripture,
            title,
          })(DevotionalTab),
          scripture: scriptureTab,
        })}
      />
    </PaddedView>
  </ScrollView>
));
