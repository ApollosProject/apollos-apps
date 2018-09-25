import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';
import Providers from 'apolloschurchapp/src/Providers';
import getScripture from 'apolloschurchapp/src/ui/Scripture/getScripture';
import Devotional from '.';

const mocks = {
  request: {
    query: getScripture,
    variables: {
      query: '1 Corinthians 15:57',
    },
  },
  result: {
    data: {
      scripture: {
        id: '1CO.15.57',
        reference: '1 Corinthians 15:57',
        html:
          '<p class="p"><span data-number="57" class="v">57</span>But thanks be to God, who gives us the victory through our Lord Jesus Christ. </p>',
      },
    },
  },
};

const title = 'God is Our Banner';

const content = {
  body:
    '<p>Sometimes God&rsquo;s promises to us involve a fight. We have to fight to keep our focus on Him, fight to move towards the promise we know God has laid on our hearts. We have a real enemy that would love nothing more than to get us sidetracked and doubt God&rsquo;s promises. So we fight saying that we are going to believe God will do what He says He will do, and we keep fighting until we see that promise come to life.</p><p>In Exodus 17:8-15 the nation of Israel, freed from great oppression in Egypt was traveling to the land God promised them. Yet, Israel was fighting, again.&nbsp;<br />&nbsp;<br />As the Israelites were fighting in the valley,&nbsp;Moses was on the hill top lifting his hands in prayer for these great fighters. Israel fought hard, and with the prayers of Moses and the help of his companions, Aaron and Hur, the Amalekites were defeated. Moses knew that it was solely because of the Lord&rsquo;s hand of protection and blessing on the Israelites that they won the battle. &ldquo;Moses built an altar and called it The Lord is my banner&rdquo; (Exodus 17:15).</p><p>In battle opposing nations would fly their own flag on a pole at each of their respective front lines. This was to give their soldiers a feeling of hope and a focal point. This is what God is to us: a banner of encouragement to give us hope and a focal point.</p><blockquote><p>The Lord protects us, covers us with love, and&nbsp;blesses us continually.</p></blockquote><p>The Lord is our banner. He protects us; He covers us with love; He blesses us continually. The Lord gives us hope and a place to focus during the tough fights when the enemy is trying to make us doubt God&rsquo;s promises.&nbsp;</p><p>When was the last time you sat and thanked Jesus for all the ways he is a banner in your life?&nbsp;</p><p>Reflect:</p><ul><li>What is one way the Lord has been your banner?</li><li>How can you focus more today on the Lord and all the things He does for you throughout the day?</li></ul>',
  route: { jumpTo: jest.fn() },
  title,
};

describe('the Devotional component', () => {
  it('renders a devotional', async () => {
    const tree = renderer.create(
      <Providers mocks={[mocks]} addTypename={false}>
        <Devotional
          content={content}
          isLoading={false}
          scripture={['1 Corinthians 15:57']}
        />
      </Providers>
    );
    await wait(0); // wait for response
    expect(tree).toMatchSnapshot();
  });
});
