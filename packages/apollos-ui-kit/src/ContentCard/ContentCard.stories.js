import React from 'react';
import { storiesOf } from '@storybook/react-native';
import BackgroundView from '../BackgroundView';

import ContentCard from '.';

storiesOf('ContentCard', module)
  .addDecorator((story) => <BackgroundView>{story()}</BackgroundView>)
  .add('Basic, with Image', () => (
    <ContentCard
      title="Acts: A 28-Day Devotional"
      summary="How does one man’s life and death change the course of history? One conversation at a time."
      coverImage={[{ uri: 'https://picsum.photos/600/400/?random' }]}
      metrics={[{ icon: 'like', value: 16848 }]}
    />
  ))
  .add('Default Placeholder', () => <ContentCard isLoading />)
  .add('No image', () => (
    <ContentCard
      title="Hurricane Florence cancels Fuse at several campuses"
      summary="As Hurricane Florence moves toward South Carolina, Gov. Henry McMaster has called for a mandatory evacuation of several coastal communities and many surrounding school districts are closing in preparation for the storm."
      metrics={[{ icon: 'like', value: 150 }]}
    />
  ))
  .add('Image only', () => (
    <ContentCard
      coverImage={[{ uri: 'https://picsum.photos/600/400/?random' }]}
      metrics={[{ icon: 'like', value: 150 }]}
    />
  ))
  .add('Tile/Basic, with Image', () => (
    <ContentCard
      tile
      title="Acts: A 28-Day Devotional"
      summary="How does one man’s life and death change the course of history? One conversation at a time."
      coverImage={[{ uri: 'https://picsum.photos/600/400/?random' }]}
      metrics={[{ icon: 'like', value: 16848 }]}
    />
  ))
  .add('Tile/Default Placeholder', () => <ContentCard tile isLoading />)
  .add('Tile/No image', () => (
    <ContentCard
      tile
      title="Hurricane Florence cancels Fuse at several campuses"
      summary="As Hurricane Florence moves toward South Carolina, Gov. Henry McMaster has called for a mandatory evacuation of several coastal communities and many surrounding school districts are closing in preparation for the storm."
      metrics={[{ icon: 'like', value: 150 }]}
    />
  ))
  .add('Tile/Image only', () => (
    <ContentCard
      tile
      coverImage={[{ uri: 'https://picsum.photos/600/400/?random' }]}
      metrics={[{ icon: 'like', value: 150 }]}
    />
  ));
