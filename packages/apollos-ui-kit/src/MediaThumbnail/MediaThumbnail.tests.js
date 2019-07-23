import React from 'react';

import renderer from 'react-test-renderer';
import { H5 } from '../typography';
import Providers from '../Providers';
import MediaThumbnail, { MediaThumbnailItem, MediaThumbnailIcon } from '.';

describe('the MediaThumbnail component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <MediaThumbnail
          forceRatio={16 / 9}
          image={[
            {
              uri: 'https://picsum.photos/900/1600/?random',
            },
          ]}
        >
          <MediaThumbnailItem top left>
            <MediaThumbnailIcon name="brand-icon" />
          </MediaThumbnailItem>
          <MediaThumbnailItem top right>
            <MediaThumbnailIcon name="like" />
          </MediaThumbnailItem>
          <MediaThumbnailItem bottom left>
            <MediaThumbnailIcon name="download" />
          </MediaThumbnailItem>
          <MediaThumbnailItem bottom right>
            <MediaThumbnailIcon name="fullscreen" />
          </MediaThumbnailItem>
          <MediaThumbnailItem centered>
            <MediaThumbnailIcon name="play" />
            <H5>Play</H5>
          </MediaThumbnailItem>
        </MediaThumbnail>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
