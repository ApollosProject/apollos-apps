import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import BackgroundView from '../BackgroundView';

import Chip from '../Chip';
import { BodyText } from '../typography';
import ActionCard from '.';

storiesOf('ui-kit/ActionCard', module)
  .addDecorator((story) => <BackgroundView>{story()}</BackgroundView>)
  .add('Examples', () => (
    <ActionCard
      label="Key Idea"
      icon="text"
      action={<Chip icon="share" title="Share" />}
    >
      <BodyText>
        “Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget
        libero posuere vulputate. Etiam elit elitbibendum.”
      </BodyText>
    </ActionCard>
  ));
