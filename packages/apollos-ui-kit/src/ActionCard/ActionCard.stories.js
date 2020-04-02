import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import CenteredView from '../CenteredView';
import BackgroundView from '../BackgroundView';

import Chip from '../Chip';
import Icon from '../Icon';
import { BodyText } from '../typography';
import ActionCard from '.';

storiesOf('ui-kit/ActionCard', module)
  .addDecorator((story) => (
    <BackgroundView>
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <CenteredView style={{ alignItems: 'stretch' }}>{story()}</CenteredView>
    </BackgroundView>
  ))
  .add('default', () => (
    <ActionCard>
      <BodyText>
        “Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget
        libero posuere vulputate. Etiam elit elitbibendum.”
      </BodyText>
    </ActionCard>
  ))
  .add('icon + label', () => (
    <ActionCard icon={'text'} label={'Key Idea'}>
      <BodyText>
        “Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget
        libero posuere vulputate. Etiam elit elitbibendum.”
      </BodyText>
    </ActionCard>
  ))
  .add('action', () => (
    <ActionCard
      action={
        <Chip title={'Share'}>
          <Icon name="share" />
        </Chip>
      }
    >
      <BodyText>
        “Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget
        libero posuere vulputate. Etiam elit elitbibendum.”
      </BodyText>
    </ActionCard>
  ));
