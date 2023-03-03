import React from 'react';
import renderer from 'react-test-renderer';
import Providers from '../Providers';
import AddCommentInput from './AddCommentInput';

describe('The AddCommentInput Component', () => {
  it('must render', () => {
    const tree = renderer.create(
      <Providers>
        <AddCommentInput openBottomSheetOnMount={false} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
