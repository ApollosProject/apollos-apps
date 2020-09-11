import React from 'react';

import { Providers, renderWithApolloData } from '../testUtils';

import SearchCardConnected from '.';

describe('The SearchCardConnected component', () => {
  it('should render', async () => {
    const data = {
      title: 'How to lead people to Jesus',
      summary:
        'Love compels a mother to lose all dignity in public as she screams the name of her lost child.',
      coverImage: {
        name: null,
        sources: [
          {
            uri:
              'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dd3a96243-2558-4c04-bf41-3aadcf41771f',
            __typename: 'ImageMediaSource',
          },
        ],
        __typename: 'ImageMedia',
      },
      cursor: 'b487224762b030f470967f45d7205823',
      node: {
        id: 'DevotionalContentItem:561dfb7dbd8a5c093fd8385c7edaadbc',
        __typename: 'DevotionalContentItem',
      },
      __typename: 'SearchResult',
    };

    const tree = await renderWithApolloData(
      <Providers>
        <SearchCardConnected
          coverImage={data.coverImage}
          summary={data.summary}
          title={data.title}
          node={data.node}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render without image', async () => {
    const data = {
      title: 'How to lead people to Jesus',
      summary:
        'Love compels a mother to lose all dignity in public as she screams the name of her lost child.',
      coverImage: null,
      cursor: 'b487224762b030f470967f45d7205823',
      node: {
        id: 'DevotionalContentItem:561dfb7dbd8a5c093fd8385c7edaadbc',
        __typename: 'DevotionalContentItem',
      },
      __typename: 'SearchResult',
    };

    const tree = await renderWithApolloData(
      <Providers>
        <SearchCardConnected
          coverImage={data.coverImage}
          summary={data.summary}
          title={data.title}
          node={data.node}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
