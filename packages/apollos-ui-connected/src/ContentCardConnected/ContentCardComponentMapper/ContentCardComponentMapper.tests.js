import React from 'react';
import renderer from 'react-test-renderer';

import { FeaturedCard } from '@apollosproject/ui-kit';

import { Providers } from '@apollosproject/ui-test-utils';

import ContentCardComponentMapper from '.';

const cardData = {
  coverImage: [
    {
      uri: 'https://picsum.photos/800/1600/?random',
    },
  ],
  labelText: 'Boom',
  summary:
    'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?',
  title: 'Are you telling me that you built a time machine out of a DeLorean?',
  __typename: 'MediaContentItem',
};

describe('The CampaignItemListFeature component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ContentCardComponentMapper {...cardData} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a HighlightCard', () => {
    const tree = renderer.create(
      <Providers>
        <ContentCardComponentMapper {...cardData} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a Component prop', () => {
    const featuredCardData = {
      actionIcon: 'umbrella',
      coverImage: [
        {
          uri: 'https://picsum.photos/800/1600/?random',
        },
      ],
      hasAction: true,
      isLive: true,
      summary:
        'The way I see it, if you’re going to build a time machine into a car, why not do it with some style?',

      title:
        'Are you telling me that you built a time machine out of a DeLorean?',
    };

    const tree = renderer.create(
      <Providers>
        <ContentCardComponentMapper
          Component={FeaturedCard}
          {...featuredCardData}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render', () => {
    const loadingStateData = {
      coverImage: [
        {
          uri: '',
        },
      ],
      isLoading: true,
      labelText: '',
      summary: '',
      title: '',
    };

    const tree = renderer.create(
      <Providers>
        <ContentCardComponentMapper {...loadingStateData} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
