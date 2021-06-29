import React from 'react';
import renderer from 'react-test-renderer';

import { View } from 'react-native';
import { Providers } from '@apollosproject/ui-test-utils';

import ProfileDetailsEntry from './ProfileDetailsEntry';

let realDateNow;

describe('ui-auth/Profile/ProfileDetailsEntry', () => {
  beforeAll(() => {
    realDateNow = Date.now.bind(global.Date);
    const dateNowStub = jest.fn(() => ({
      setFullYear: () => null,
      getFullYear: () => 2021,
      getMonth: () => 5,
      getDate: () => 17,
    }));
    global.Date.now = dateNowStub;
  });
  afterAll(() => {
    global.Date.now = realDateNow;
  });
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntry
          setFieldValue={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render when disabled', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntry
          setFieldValue={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
          disabled
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a different prompt and title', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntry
          setFieldValue={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
          title="Welcome to Apollos"
          prompt="It's great!"
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with errors', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntry
          setFieldValue={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
          errors={{
            phone: 'Boom errors.phone Boom',
            birthDate: 'Some birth date error',
          }}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntry
          setFieldValue={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
          isLoading
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a different background component', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntry
          setFieldValue={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
          BackgroundComponent={View}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a different gender list', () => {
    const tree = renderer.create(
      <Providers>
        <ProfileDetailsEntry
          setFieldValue={jest.fn()}
          defaultDate={'2019-02-14T05:00:00.000Z'}
          genderList={['Female', 'Male', 'Undisclosed']}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
