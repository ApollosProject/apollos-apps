import React from 'react';
import renderer from 'react-test-renderer';

import Providers from '../../Providers';
import { withIsLoading } from '../../isLoading';

import ActionListItem from '.';

describe('ActionListItem', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListItem imageSource={'https://picsum.photos/600/400/?random'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a title', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListItem
          imageSource={'https://picsum.photos/600/400/?random'}
          title={'Boom'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a label', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListItem
          imageSource={'https://picsum.photos/600/400/?random'}
          label={'What'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with an event', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListItem
          imageSource={null}
          label={'What'}
          start={'11/02/1996'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should handle an onPress function', () => {
    const tree = renderer.create(
      <Providers>
        <ActionListItem
          imageSource={'https://picsum.photos/600/400/?random'}
          onPress={() => {}}
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
          />
        </SetIsLoading>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
