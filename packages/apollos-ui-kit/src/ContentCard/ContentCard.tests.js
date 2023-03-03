import React from 'react';
import renderer from 'react-test-renderer';
import Providers from '../Providers';

import ContentCard from '.';

const withSnapshotTest = (snapshot) => () => {
  const tree = renderer.create(<Providers>{snapshot}</Providers>);
  expect(tree).toMatchSnapshot();
};

describe('ContentCard', () => {
  it(
    'renders Basic card, with Image',
    withSnapshotTest(
      <ContentCard
        title="Acts: A 28-Day Devotional"
        summary="How does one man’s life and death change the course of history? One conversation at a time."
        coverImage={[{ uri: 'https://picsum.photos/600/400/?random' }]}
        metrics={[{ icon: 'like', value: 16848 }]}
      />
    )
  );
  it(
    'renders a Default Placeholder',
    withSnapshotTest(<ContentCard isLoading />)
  );
  it(
    'renders with No image',
    withSnapshotTest(
      <ContentCard
        title="Hurricane Florence cancels Fuse at several campuses"
        summary="As Hurricane Florence moves toward South Carolina, Gov. Henry McMaster has called for a mandatory evacuation of several coastal communities and many surrounding school districts are closing in preparation for the storm."
        metrics={[{ icon: 'like', value: 150 }]}
      />
    )
  );
  it(
    'renders with an Image only',
    withSnapshotTest(
      <ContentCard
        coverImage={[{ uri: 'https://picsum.photos/600/400/?random' }]}
        metrics={[{ icon: 'like', value: 150 }]}
      />
    )
  );
  it(
    'renders basic tile card, with Image',
    withSnapshotTest(
      <ContentCard
        tile
        title="Acts: A 28-Day Devotional"
        summary="How does one man’s life and death change the course of history? One conversation at a time."
        coverImage={[{ uri: 'https://picsum.photos/600/400/?random' }]}
        metrics={[{ icon: 'like', value: 16848 }]}
      />
    )
  );
  it(
    'renders with Default Placeholder',
    withSnapshotTest(<ContentCard tile isLoading />)
  );
  it(
    'renders as Tile/No image',
    withSnapshotTest(
      <ContentCard
        tile
        title="Hurricane Florence cancels Fuse at several campuses"
        summary="As Hurricane Florence moves toward South Carolina, Gov. Henry McMaster has called for a mandatory evacuation of several coastal communities and many surrounding school districts are closing in preparation for the storm."
        metrics={[{ icon: 'like', value: 150 }]}
      />
    )
  );
  it(
    'renders as Tile/Image only',
    withSnapshotTest(
      <ContentCard
        tile
        coverImage={[{ uri: 'https://picsum.photos/600/400/?random' }]}
        metrics={[{ icon: 'like', value: 150 }]}
      />
    )
  );
});
