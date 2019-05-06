import React from 'react';
import { storiesOf } from 'ApollosStorybook/native-storybook';



import { BodyText } from '../typography';

import ButtonLink from './ButtonLink';

storiesOf('Buttons/Link', module)
  .add('default', () => <ButtonLink onPress={() => {}}>Boom</ButtonLink>)
  .add('Inherits typographic styles', () => (
    <BodyText>
      <ButtonLink onPress={() => {}}>Boom</ButtonLink>
    </BodyText>
  ));
