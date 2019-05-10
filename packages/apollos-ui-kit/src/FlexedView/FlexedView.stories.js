import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { H1 } from '../typography';
import styled from '../styled';

import FlexedView from '.';

storiesOf('ui-kit/FlexedView', module).add('Example', () => {
  const FlexedSalmonView = styled({
    backgroundColor: 'salmon',
  })(FlexedView);

  return (
    <FlexedView>
      <FlexedSalmonView>
        <H1>This box is in a FlexedView</H1>
      </FlexedSalmonView>
    </FlexedView>
  );
});
