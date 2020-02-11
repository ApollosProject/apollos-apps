/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../../utils/testUtils';

import PlayButton from './PlayButton';

describe('PlayButton', () => {
  it('renders a PlayButton', () => {
    const tree = renderer.create(
      <Providers>
        <PlayButton
          action={jest.fn()}
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
    expect(tree).toMatchSnapshot();
  });
});
