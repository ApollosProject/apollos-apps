import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../testUtils';

import ProfileDetailsEntry from './ProfileDetailsEntry';

describe('ui-auth/Profile/ProfileEntry', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntry setFieldValue={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
