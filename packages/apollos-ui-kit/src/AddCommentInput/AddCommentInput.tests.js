import React from 'react';
import renderer from 'react-test-renderer';
import Providers from '../Providers';
import AddCommentInput from './AddCommentInput';

describe('The AddCommentInput Component', () => {
  it('must render', () => {
    const tree = renderer.create(
      <Providers>
        <AddCommentInput
          profile={{
            image: { uri: 'https://picsum.photos/200' },
          }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('must render without an avatar', () => {
    const tree = renderer.create(
      <Providers>
        <AddCommentInput />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
