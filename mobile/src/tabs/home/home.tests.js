import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Providers from 'Providers';

import Home from './Home';
import getUserFeed from './getUserFeed.graphql';

describe('User Home Feed Query', () => {
  it('should return correct query results', () => {
    const mock = {
      request: {
        query: getUserFeed,
        variables: {
          id: 'UniversalContentItem:678b4a38968fc6004dd8b23e586c923e',
        },
      },
      result: {
        data: {
          id: 'UniversalContentItem:678b4a38968fc6004dd8b23e586c923e',
          coverImage: {
            name: 'Square Image',
            sources: [
              {
                uri:
                  'https://apollosrock.newspring.cc/GetImage.ashx?guid=ed857076-2623-4fdc-8476-50b3a60e0b68',
              },
            ],
          },
          parentChannel: {
            id: 'ContentChannel:7fba1b1ee253e0fd5f0795b4b8b1175e',
            name: 'Devotion Series',
            iconName: 'text',
          },
          title: 'Psalms: A 28-Day Devotional',
        },
      },
    };

    const tree = renderer.create(
      <Providers mocks={[mock]} addTypename={false}>
        <Home id="UniversalContentItem:678b4a38968fc6004dd8b23e586c923e" />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
