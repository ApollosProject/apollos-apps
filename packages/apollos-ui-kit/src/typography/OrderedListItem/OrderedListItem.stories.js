import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import { withIsLoading } from '../../isLoading';
import PaddedView from '../../PaddedView';

import OrderedListItem from '.';

storiesOf('ui-kit/typography/OrderedListItem', module)
  .add('Default', () => (
    <PaddedView>
      <OrderedListItem index={1}>
        {`"God's work done in God's way will never lack God's supplies." – Hudson Taylor`}
      </OrderedListItem>
    </PaddedView>
  ))
  .add('isLoading', () => {
    const SetIsLoading = withIsLoading(PaddedView);

    return (
      <SetIsLoading isLoading>
        <OrderedListItem index={1}>
          {`"God's work done in God's way will never lack God's supplies." – Hudson Taylor`}
        </OrderedListItem>
      </SetIsLoading>
    );
  });
