import React from 'react';
import {
  IntrospectionFragmentMatcher,
  InMemoryCache,
} from 'apollo-cache-inmemory';
import introspectionQueryResultData from 'apolloschurchapp/src/client/fragmentTypes.json';

import { Providers, renderWithApolloData } from '../utils/testUtils';

import GET_CONTENT_ITEM_FEATURES from './getContentItemFeatures';

import FeaturesConnected from './FeaturesConnected';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

describe('FeaturesConnected', () => {
  it('should render', async () => {
    const mock = {
      request: {
        query: GET_CONTENT_ITEM_FEATURES,
        variables: {
          contentId: 'WeekendContentItem:1',
        },
      },
      result: {
        data: {
          node: {
            id: 'WeekendContentItem:1',
            features: [
              {
                id: 'TextFeature:2a5b59e962544d9dcece1917a754a1df',
                body: 'this is another, text feature',
                sharing: {
                  message: 'this is another, text feature',
                  __typename: 'SharableFeature',
                },
                scriptures: [
                  {
                    id:
                      'Scripture:64d68f218913cf16a8b4aab91753e774db83c13fcfc8f8f7916525e4abec61da7185c04db7fe4f4e7fcd804d983e54c3afe0945b61491c894397c846a91004af',
                    html:
                      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">¶ For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.</span> </p>',
                    reference: 'John 3:16',
                    copyright:
                      'PUBLIC DOMAIN except in the United Kingdom, where a Crown Copyright applies to printing the KJV. See http://www.cambridge.org/about-us/who-we-are/queens-printers-patent',
                    version: 'KJV',
                    __typename: 'Scripture',
                  },
                ],
                __typename: 'TextFeature',
              },
              {
                id: 'ScriptureFeature:f690b5379eff177c5e34075ff824bd6b',
                body: 'this is another, text feature',
                sharing: {
                  message:
                    '16For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.   John 3:16',
                  __typename: 'SharableFeature',
                },
                scriptures: [
                  {
                    id:
                      'Scripture:64d68f218913cf16a8b4aab91753e774db83c13fcfc8f8f7916525e4abec61da7185c04db7fe4f4e7fcd804d983e54c3afe0945b61491c894397c846a91004af',
                    html:
                      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">¶ For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.</span> </p>',
                    reference: 'John 3:16',
                    copyright:
                      'PUBLIC DOMAIN except in the United Kingdom, where a Crown Copyright applies to printing the KJV. See http://www.cambridge.org/about-us/who-we-are/queens-printers-patent',
                    version: 'KJV',
                    __typename: 'Scripture',
                  },
                ],
                __typename: 'ScriptureFeature',
              },
              {
                id: 'ScriptureFeature:0e4e3fb6e031c94579b231db2dc10c85',
                body: 'this is another, text feature',
                sharing: {
                  message:
                    '16For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.   John 3:16',
                  __typename: 'SharableFeature',
                },
                scriptures: [
                  {
                    id:
                      'Scripture:64d68f218913cf16a8b4aab91753e7748c6989b388d0a31256790b6b814122da033b13868d59fe5facedf2e3c14bf45c87ec34dc5a657c8d1d3da39ee1bc80d8',
                    html:
                      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">For God so loved the world, that he gave his only born</span> <span class="wj">Son, that whoever believes in him should not perish, but have eternal life. </span> </p>',
                    reference: 'John 3:16',
                    copyright: 'PUBLIC DOMAIN',
                    version: 'WEB',
                    __typename: 'Scripture',
                  },
                ],
                __typename: 'ScriptureFeature',
              },
            ],
            __typename: 'WeekendContentItem',
          },
        },
      },
    };
    const tree = await renderWithApolloData(
      <Providers
        mocks={[mock]}
        cache={
          new InMemoryCache({
            fragmentMatcher,
          })
        }
      >
        <FeaturesConnected contentId={'WeekendContentItem:1'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
