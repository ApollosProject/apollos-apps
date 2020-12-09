import React from 'react';
import { Providers, renderWithApolloData } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';
import ScriptureNodeConnected from './ScriptureNodeConnected';
import GET_SCRIPTURE_NODE from './getScriptureNode';

const psalm32 = {
  id: 'Scripture:123',
  __typename: 'Scripture',
  reference: 'Psalm 32',
  html:
    '<p class="d">By David. A contemplative psalm.</p><p class="q1"><span data-number="1" class="v">1</span>Blessed is he whose disobedience is forgiven,</p><p class="q2">whose sin is covered.</p><p class="q1"><span data-number="2" class="v">2</span>Blessed is the man to whom Yahweh doesn’t impute iniquity,</p><p class="q2">in whose spirit there is no deceit.</p><p class="q1"><span data-number="3" class="v">3</span>When I kept silence, my bones wasted away through my groaning all day long.</p><p class="q1"><span data-number="4" class="v">4</span>For day and night your hand was heavy on me.</p><p class="q2">My strength was sapped in the heat of summer. <span class="qs">Selah.</span></p><p class="q1"><span data-number="5" class="v">5</span>I acknowledged my sin to you.</p><p class="q2">I didn’t hide my iniquity.</p><p class="q1">I said, I will confess my transgressions to Yahweh,</p><p class="q2">and you forgave the iniquity of my sin. <span class="qs">Selah.</span></p><p class="q1"><span data-number="6" class="v">6</span>For this, let everyone who is godly pray to you in a time when you may be found.</p><p class="q2">Surely when the great waters overflow, they shall not reach to him.</p><p class="q1"><span data-number="7" class="v">7</span>You are my hiding place.</p><p class="q2">You will preserve me from trouble.</p><p class="q2">You will surround me with songs of deliverance. <span class="qs">Selah.</span></p><p class="q1"><span data-number="8" class="v">8</span>I will instruct you and teach you in the way which you shall go.</p><p class="q2">I will counsel you with my eye on you.</p><p class="q1"><span data-number="9" class="v">9</span>Don’t be like the horse, or like the mule, which have no understanding,</p><p class="q2">who are controlled by bit and bridle, or else they will not come near to you.</p><p class="q1"><span data-number="10" class="v">10</span>Many sorrows come to the wicked,</p><p class="q2">but loving kindness shall surround him who trusts in Yahweh.</p><p class="q1"><span data-number="11" class="v">11</span>Be glad in Yahweh, and rejoice, you righteous!</p><p class="q2">Shout for joy, all you who are upright in heart!</p>',
  copyright:
    'PUBLIC DOMAIN except in the United Kingdom, where a Crown Copyright applies to printing the KJV. See http://www.cambridge.org/about-us/who-we-are/queens-printers-patent',
  version: 'WEB',
};

const scriptureMock = {
  request: {
    query: GET_SCRIPTURE_NODE,
    variables: {
      nodeId: 'DevotionalContentItem:1',
    },
  },
  result: {
    data: {
      node: {
        __typename: 'DevotionalContentItem',
        id: 'DevotionalContentItem:1',
        scriptures: [psalm32],
      },
    },
  },
};

describe('ContentNodeConnected', () => {
  it('should render', async () => {
    const tree = await renderWithApolloData(
      <Providers MockedProvider={MockedProvider} mocks={[scriptureMock]}>
        <ScriptureNodeConnected nodeId={'DevotionalContentItem:1'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
