/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import renderer from 'react-test-renderer';
import wait from 'waait';

import { Providers } from '../../testUtils';

import PlayButton from './PlayButton';

describe('PlayButton', () => {
  it('should render', async () => {
    const tree = renderer.create(
      <Providers>
        <PlayButton
          onPress={jest.fn()}
          coverImageSources={[
            {
              uri:
                'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,q_auto:eco,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dfe44d493-b69f-4721-83f7-7942c4f99125',
              __typename: 'ImageMediaSource',
            },
          ]}
        />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
  it('should render with custom title', async () => {
    const tree = renderer.create(
      <Providers>
        <PlayButton
          onPress={jest.fn()}
          coverImageSources={[
            {
              uri:
                'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,q_auto:eco,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dfe44d493-b69f-4721-83f7-7942c4f99125',
              __typename: 'ImageMediaSource',
            },
          ]}
          title={'CUSTOM_TITLE'}
        />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
  it('should render with custom play icon', async () => {
    const tree = renderer.create(
      <Providers>
        <PlayButton
          onPress={jest.fn()}
          coverImageSources={[
            {
              uri:
                'https://res.cloudinary.com/apollos/image/fetch/c_limit,f_auto,q_auto:eco,w_1600/https://apollosrock.newspring.cc/GetImage.ashx%3Fguid%3Dfe44d493-b69f-4721-83f7-7942c4f99125',
              __typename: 'ImageMediaSource',
            },
          ]}
          icon={'play-solid'}
        />
      </Providers>
    );
    await wait(0); // wait for response from graphql
    expect(tree).toMatchSnapshot();
  });
});
