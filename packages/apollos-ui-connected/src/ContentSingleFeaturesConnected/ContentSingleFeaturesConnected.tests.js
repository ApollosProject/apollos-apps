import React from 'react';
import { Providers, renderWithApolloData } from '../utils/testUtils';

import GET_CONTENT_ITEM_FEATURES from './getContentItemFeatures';

import ContentSingleFeaturesConnected from './ContentSingleFeaturesConnected';

describe('ContentSingleFeaturesConnected', () => {
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
                id: 'WebviewFeature:6',
                url:
                  'https://open.spotify.com/embed/user/spotify/playlist/37i9dQZF1DWWvHBEQLnV1N',
                title: 'Test Title',
                linkText: 'Text Link Text',
                __typename: 'WebviewFeature',
              },
              {
                id: 'TextFeature:1',
                body: 'this is another, text feature',
                sharing: {
                  message: 'this is another, text feature',
                  __typename: 'SharableFeature',
                },
                scriptures: [
                  {
                    id: 'Scripture:2',
                    html:
                      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">¶ For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.</span> </p>',
                    reference: 'Matthew 4:10',
                    copyright:
                      'PUBLIC DOMAIN except in the United Kingdom, where a Crown Copyright applies to printing the KJV. See http://www.cambridge.org/about-us/who-we-are/queens-printers-patent',
                    version: 'KJV',
                    __typename: 'Scripture',
                  },
                ],
                __typename: 'TextFeature',
              },
              {
                id: 'ScriptureFeature:3',
                body: 'this is another, scripture feature',
                sharing: {
                  message:
                    '16For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.   Luke 1:2',
                  __typename: 'SharableFeature',
                },
                scriptures: [
                  {
                    id: 'Scripture:4',
                    html:
                      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">¶ For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.</span> </p>',
                    reference: 'Mark 1:12',
                    copyright:
                      'PUBLIC DOMAIN except in the United Kingdom, where a Crown Copyright applies to printing the KJV. See http://www.cambridge.org/about-us/who-we-are/queens-printers-patent',
                    version: 'KJV',
                    __typename: 'Scripture',
                  },
                ],
                __typename: 'ScriptureFeature',
              },
              {
                id: 'ScriptureFeature:4',
                body: 'this is another, scripture feature',
                sharing: {
                  message:
                    '16For God so loved the world, that he gave his only born Son, that whoever believes in him should not perish, but have eternal life.   John 3:16',
                  __typename: 'SharableFeature',
                },
                scriptures: [
                  {
                    id: 'Scripture:5',
                    html:
                      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">For God so loved the world, that he gave his only born</span> <span class="wj">Son, that whoever believes in him should not perish, but have eternal life, forever. </span> </p>',
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
      <Providers mocks={[mock]}>
        <ContentSingleFeaturesConnected contentId={'WeekendContentItem:1'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
