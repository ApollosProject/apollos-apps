import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

import ProfileEntry from './ProfileEntry';

describe('ui-auth/Profile/ProfileEntry', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileEntry setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
