import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';
import { withIsLoading } from '../../isLoading';

import ActionListItem from '.';

describe('ActionListItem', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListItem
          onPress={() => {}}
          imageSource={'https://picsum.photos/600/400/?random'}
          title={'Boom'}
          relatedNodeId={'fakeID'}
          action={'fakeAction'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a label', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListItem
          onPress={() => {}}
          imageSource={'https://picsum.photos/600/400/?random'}
          title={'Boom'}
          label={'What'}
          relatedNodeId={'fakeID'}
          action={'fakeAction'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const SetIsLoading = withIsLoading(({ children }) => children);
    const tree = renderer.create(
      <Providers>
        <SetIsLoading isLoading>
          <ActionListItem
            onPress={() => {}}
            imageSource={'https://picsum.photos/600/400/?random'}
            title={'Boom'}
            label={'What'}
            relatedNodeId={'fakeID'}
            action={'fakeAction'}
          />
        </SetIsLoading>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
