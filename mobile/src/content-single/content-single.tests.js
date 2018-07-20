import React from 'react';
import renderer from 'react-test-renderer';

import Providers from 'Providers';

import getContentItem from './getContentItem.graphql';
import getContentItemMinimalState from './getContentItemMinimalState.graphql';

import ContentSingle from './index';

describe('Test of the ContentSingle Query Component', () => {
  it('Should return the results for Content Single Minimal State', () => {
    const mockOne = {
      request: {
        query: getContentItemMinimalState,
      },
      result: {
        data: {
          node: {
            id: 'UniversalContentItem:1c627c20911791321f819125a65c3c9d',
            title: 'Money Wise',
            coverImage: {
              name: 'Series Image',
              sources: [
                {
                  uri:
                    'https://apollosrock.newspring.cc/GetImage.ashx?guid=33e4c568-a456-4250-a8dc-6a4ceb548455',
                },
              ],
            },
          },
        },
      },
    };
    const mockTwo = {
      request: {
        query: getContentItem,
      },
      result: {
        data: {
          node: {
            id: 'UniversalContentItem:1c627c20911791321f819125a65c3c9d',
            title: 'Money Wise',
            htmlContent:
              '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dignissim euismod arcu, volutpat feugiat tortor luctus vitae. Suspendisse efficitur faucibus ante at facilisis. Phasellus in velit suscipit lectus tempus dapibus vitae eu quam. Fusce venenatis mauris non ante scelerisque, sit amet blandit odio ultricies. In sed lacinia dui, eu blandit metus. Ut ante enim, facilisis sed pretium et, posuere vitae felis. Phasellus ornare mauris mauris, eget pretium nibh imperdiet ac. Integer eleifend dui ut nisl sagittis mattis. Nunc consectetur consequat tristique. Pellentesque luctus tortor nec quam pulvinar iaculis.<br /></p>',
            coverImage: {
              name: 'Series Image',
              sources: [
                {
                  uri:
                    'https://apollosrock.newspring.cc/GetImage.ashx?guid=33e4c568-a456-4250-a8dc-6a4ceb548455',
                },
              ],
            },
            childContentItemsConnection: {
              edges: [
                {
                  node: {
                    id: 'UniversalContentItem:b3546fa6671ae7a048e65c25b4891b88',
                    coverImage: {
                      name: 'Square Image',
                      sources: [
                        {
                          uri:
                            'https://apollosrock.newspring.cc/GetImage.ashx?guid=6dd8f746-d1bd-4213-aa7d-81fd7415f068',
                        },
                      ],
                    },
                    parentChannel: {
                      id: 'ContentChannel:772fcb6087247ebad630814e2ce0cd16',
                      name: 'Sermon',
                      iconName: 'text',
                    },
                    title: 'Of Faith and Firsts',
                  },
                },
                {
                  node: {
                    id: 'UniversalContentItem:9712de06eab8adc3050f8f96d72b79b3',
                    coverImage: {
                      name: 'Square Image',
                      sources: [
                        {
                          uri:
                            'https://apollosrock.newspring.cc/GetImage.ashx?guid=ad8c1f24-ad0c-45fe-90f6-6f03bad93a12',
                        },
                      ],
                    },
                    parentChannel: {
                      id: 'ContentChannel:772fcb6087247ebad630814e2ce0cd16',
                      name: 'Sermon',
                      iconName: 'text',
                    },
                    title: 'Of Myths and Money',
                  },
                },
              ],
            },
          },
        },
      },
    };

    const navigation = {
      getParam: jest.fn(),
      push: jest.fn(),
    };
    const tree = renderer.create(
      <Providers mocks={[mockOne, mockTwo]}>
        <ContentSingle navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
