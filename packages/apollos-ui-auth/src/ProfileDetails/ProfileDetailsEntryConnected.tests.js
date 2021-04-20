import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '@apollosproject/ui-test-utils';

import ProfileDetailsEntryConnected from './ProfileDetailsEntryConnected';

let realDateNow;

describe('ui-auth/Profile/ProfileDetailsEntryConnected', () => {
  beforeAll(() => {
    realDateNow = Date.now.bind(global.Date);
    const dateNowStub = jest.fn(() => 1530518207007);
    global.Date.now = dateNowStub;
  });
  afterAll(() => {
    global.Date.now = realDateNow;
  });
  it('should render', () => {
    const navigation = { navigate: jest.fn() };

    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntryConnected navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
