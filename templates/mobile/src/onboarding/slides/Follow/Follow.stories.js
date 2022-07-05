import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import Follow from './Follow';

storiesOf('ui-onboarding/slides/Follow', module)
  .add('default', () => <Follow />)
  .add('followers', () => (
    <Follow followers={[{ firstName: 'Joe', lastName: 'Schmoe' }]} />
  ))
  .add('slideTitle', () => <Follow slideTitle={'Custom title text'} />)
  .add('description', () => <Follow description={'Custom description text'} />)
  .add('BackgroundComponent', () => (
    <Follow
      BackgroundComponent={
        <GradientOverlayImage
          source={'https://picsum.photos/750/750/?random'}
        />
      }
    />
  ))
  .add('Slide props', () => <Follow onPressPrimary={() => {}} />);
