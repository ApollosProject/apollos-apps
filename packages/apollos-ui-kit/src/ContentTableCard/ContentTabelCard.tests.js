import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../Providers';
import { H3 } from '../typography';

import ContentTableCard from '.';

const content = [
  {
    id: 'fakeId1',
    title: 'Hello 1',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400?random',
      },
    },
  },
  {
    id: 'fakeId2',
    title: 'Hello 2',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400?random',
      },
    },
  },
  {
    id: 'fakeId3',
    title: 'Hello 3',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400?random',
      },
    },
  },
  {
    id: 'fakeId4',
    title: 'Hello 4',
    subtitle: 'Boom',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400?random',
      },
    },
  },
];

describe('ContentTableCard', () => {
  it('should render 4 items', () => {
    const tree = renderer.create(
      <Providers>
        <ContentTableCard onPress={() => {}} content={content} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a header', () => {
    const tree = renderer.create(
      <Providers>
        <ContentTableCard
          onPress={() => {}}
          content={content}
          header={
            <H3 numberOfLines={3} ellipsizeMode="tail">
              Custom Header Element
            </H3>
          }
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  // it('should render a loading state', () => {
  //   const tree = renderer.create(
  //     <Providers>
  //       <ContentTableCard onPress={() => {}} isLoading content={content} />
  //     </Providers>
  //   );
  //   expect(tree).toMatchSnapshot();
  // });
});
