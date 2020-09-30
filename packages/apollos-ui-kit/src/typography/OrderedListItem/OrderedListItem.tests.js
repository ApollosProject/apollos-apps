import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';
import { withIsLoading } from '../../isLoading';
import { H5 } from '..';

import OrderedListItem from '.';

describe('the OrderedListItem component', () => {
  it('should render a string', () => {
    const tree = renderer.create(
      <Providers>
        <OrderedListItem index={1}>
          {`"God's work done in God's way will never lack God's supplies." – Hudson Taylor`}
        </OrderedListItem>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render render child components', () => {
    const tree = renderer.create(
      <Providers>
        <OrderedListItem index={1}>
          <H5>
            {`"God's work done in God's way will never lack God's supplies." – Hudson Taylor`}
          </H5>
        </OrderedListItem>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const OrderedListLoadingState = withIsLoading(OrderedListItem);
    const tree = renderer.create(
      <Providers>
        <OrderedListLoadingState index={1} isLoading>
          {`"God's work done in God's way will never lack God's supplies." – Hudson Taylor`}
        </OrderedListLoadingState>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
