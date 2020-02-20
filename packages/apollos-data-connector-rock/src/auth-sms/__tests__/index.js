import { graphql } from 'graphql';
import { fetch } from 'apollo-server-env';
import ApollosConfig from '@apollosproject/config';
import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { peopleSchema } from '@apollosproject/data-schema';

import * as AuthSms from '../index';
import * as Auth from '../../auth/index';
import * as Person from '../../people/index';

ApollosConfig.loadJs({
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
  },
});

const sendSms = jest.fn();

class SmsDataSource {
  // eslint-disable-next-line
  initialize() {
    /* noop() */
  }

  sendSms = sendSms;
}

const Sms = {
  dataSource: SmsDataSource,
};

const { getContext, getSchema } = createTestHelpers({
  Auth,
  AuthSms,
  Sms,
  Person,
});

describe('AuthSms schema', () => {
  let schema;
  let context;
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
    schema = getSchema([peopleSchema]);
    context = getContext();
    sendSms.mockClear();
  });

  it('checks to see if a user exists via phone number', async () => {
    const query = `
      query {
        userExists(identity: "5133061126")
      }
    `;
    const rootValue = {};

    const userExistsMock = jest.fn(() => Promise.resolve(true));

    context.dataSources.Auth.personExists = userExistsMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(userExistsMock).toMatchSnapshot();
  });

  it("checks to see if a user exists via phone number and returns differently if they don't", async () => {
    const query = `
      query {
        userExists(identity: "5133061126")
      }
    `;
    const rootValue = {};

    const userExistsMock = jest.fn(() => Promise.resolve(false));

    context.dataSources.Auth.personExists = userExistsMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(userExistsMock).toMatchSnapshot();
  });

  it('checks to see if a user exists via email', async () => {
    const query = `
      query {
        userExists(phoneNumber: "vincent.wilson@differential.com")
      }
    `;
    const rootValue = {};

    const userExistsMock = jest.fn(() => Promise.resolve(true));

    context.dataSources.Auth.personExists = userExistsMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(userExistsMock).toMatchSnapshot();
  });

  it('requests an SMS pin without an existing user login', async () => {
    const query = `
      mutation {
        requestSmsLoginPin(phoneNumber: "5133061126") { success, userAuthStatus }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn(() => Promise.resolve([]));
    const deleteMock = jest.fn();
    const postMock = jest.fn();

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.delete = deleteMock;
    context.dataSources.AuthSms.post = postMock;
    context.dataSources.AuthSms.generateSmsPinAndPassword = jest.fn(
      () => '123password'
    );

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot('get existing login');
    expect(deleteMock.mock.calls).toMatchSnapshot('delete existing login');
    expect(postMock.mock.calls).toMatchSnapshot('create new login');
    expect(sendSms.mock.calls).toMatchSnapshot('send sms');
  });

  it('requests an SMS pin with an existing user login', async () => {
    const query = `
      mutation {
        requestSmsLoginPin(phoneNumber: "5133061126") { success, userAuthStatus }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn(() =>
      Promise.resolve([{ id: 123, personId: 123 }])
    );
    const deleteMock = jest.fn();
    const postMock = jest.fn();

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.delete = deleteMock;
    context.dataSources.AuthSms.post = postMock;
    context.dataSources.AuthSms.generateSmsPinAndPassword = jest.fn(
      () => '123password'
    );

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot('get existing login');
    expect(deleteMock.mock.calls).toMatchSnapshot('delete existing login');
    expect(postMock.mock.calls).toMatchSnapshot('create new login');
    expect(sendSms.mock.calls).toMatchSnapshot('send sms');
  });

  it('requests an SMS pin with an existing user login without a personId', async () => {
    const query = `
      mutation {
        requestSmsLoginPin(phoneNumber: "5133061126") { success }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn(() => Promise.resolve([{ id: 123 }]));
    const deleteMock = jest.fn();
    const postMock = jest.fn();

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.delete = deleteMock;
    context.dataSources.AuthSms.post = postMock;
    context.dataSources.AuthSms.generateSmsPinAndPassword = jest.fn(
      () => '123password'
    );

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot('get new login');
    expect(deleteMock.mock.calls).toMatchSnapshot('delete existing login');
    expect(postMock.mock.calls).toMatchSnapshot('create new login');
    expect(sendSms.mock.calls).toMatchSnapshot('send sms');
  });

  it('generates a new password each time', () => {
    const {
      pin: pin1,
      password: password1,
    } = context.dataSources.AuthSms.generateSmsPinAndPassword();
    const {
      pin: pin2,
      password: password2,
    } = context.dataSources.AuthSms.generateSmsPinAndPassword();
    expect(pin1).not.toBe(pin2);
    expect(pin1.length).toBe(6);
    expect(typeof pin1).toBe('string');

    expect(password1).not.toBe(password2);
  });

  it('throws an error on invalid phone numbers', async () => {
    const query = `
      mutation {
        requestSmsLoginPin(phoneNumber: "30123") { success }
      }
    `;
    const rootValue = {};

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
  });

  it('logs an existing user in via their phone number and pin', async () => {
    const query = `
      mutation {
        authenticateWithSms(phoneNumber: "5133061126", pin: "123456") {
          token
        }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn(() => Promise.resolve([{ personId: 123 }]));
    const patchMock = jest.fn();
    const authenticateMock = jest.fn(() =>
      Promise.resolve({ token: 'foo', rockCookie: 'bar' })
    );

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.patch = patchMock;
    context.dataSources.Auth.authenticate = authenticateMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot('gets existing user login');
    expect(patchMock.mock.calls).toMatchSnapshot('update person id on login');
    expect(authenticateMock.mock.calls).toMatchSnapshot('login user');
  });

  it('logs a new user in via their phone number and pin', async () => {
    const query = `
      mutation {
        authenticateWithSms(phoneNumber: "5133061126", pin: "123456") {
          token
        }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn((path) => {
      if (path.includes('/PhoneNumbers')) {
        return Promise.resolve([]);
      }
      return Promise.resolve([{ id: 123 }]);
    });
    const patchMock = jest.fn();
    const authenticateMock = jest.fn(() =>
      Promise.resolve({ token: 'foo', rockCookie: 'bar' })
    );
    const postMock = jest.fn();
    const createUserProfileMock = jest.fn(() => Promise.resolve(123));

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.patch = patchMock;
    context.dataSources.AuthSms.post = postMock;
    context.dataSources.Auth.authenticate = authenticateMock;
    context.dataSources.Auth.createUserProfile = createUserProfileMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot(
      'try and find phone number / find user login'
    );
    expect(patchMock.mock.calls).toMatchSnapshot('update person id on login');
    expect(authenticateMock.mock.calls).toMatchSnapshot('login user');
    expect(postMock.mock.calls).toMatchSnapshot('create new phone number');
    expect(createUserProfileMock.mock.calls).toMatchSnapshot(
      'create user profile'
    );
  });

  it('logs a user with multiple phone numbers in via their phone number and pin', async () => {
    const query = `
      mutation {
        authenticateWithSms(phoneNumber: "5133061126", pin: "123456") {
          token
        }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn((path) => {
      if (path.includes('/PhoneNumbers')) {
        return Promise.resolve([
          { id: 123, personId: 456 },
          { id: 456, personId: 789 },
        ]);
      }
      return Promise.resolve([{ id: 1110 }]);
    });
    const patchMock = jest.fn();
    const authenticateMock = jest.fn(() =>
      Promise.resolve({ token: 'foo', rockCookie: 'bar' })
    );
    const postMock = jest.fn();
    const createUserProfileMock = jest.fn(() => Promise.resolve(123456));

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.patch = patchMock;
    context.dataSources.AuthSms.post = postMock;
    context.dataSources.Auth.authenticate = authenticateMock;
    context.dataSources.Auth.createUserProfile = createUserProfileMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot(
      'find phone numbers / find user login'
    );
    expect(patchMock.mock.calls).toMatchSnapshot('update person id on login');
    expect(authenticateMock.mock.calls).toMatchSnapshot('login user');
    expect(postMock.mock.calls).toMatchSnapshot('create new phone number');
    expect(createUserProfileMock.mock.calls).toMatchSnapshot(
      'create user profile'
    );
  });

  it('logs a new user with a single phone number in via their phone number and pin', async () => {
    const query = `
      mutation {
        authenticateWithSms(phoneNumber: "5133061126", pin: "123456") {
          token
        }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn((path) => {
      if (path.includes('/PhoneNumbers')) {
        return Promise.resolve([{ id: 123, personId: 456 }]);
      }
      return Promise.resolve([{ id: 1110 }]);
    });
    const patchMock = jest.fn();
    const authenticateMock = jest.fn(() =>
      Promise.resolve({ token: 'foo', rockCookie: 'bar' })
    );
    const postMock = jest.fn();
    const createUserProfileMock = jest.fn(() => Promise.resolve(123456));

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.patch = patchMock;
    context.dataSources.AuthSms.post = postMock;
    context.dataSources.Auth.authenticate = authenticateMock;
    context.dataSources.Auth.createUserProfile = createUserProfileMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot(
      'find phone number / find user login'
    );
    expect(patchMock.mock.calls).toMatchSnapshot('update person id on login');
    expect(authenticateMock.mock.calls).toMatchSnapshot('login user');
    expect(postMock.mock.calls).toMatchSnapshot('create new phone number');
    expect(createUserProfileMock.mock.calls).toMatchSnapshot(
      'create user profile'
    );
  });

  it('throws an error if the user login is not found', async () => {
    const query = `
      mutation {
        authenticateWithSms(phoneNumber: "5133061126", pin: "123456") {
          token
        }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn((path) => {
      if (path.includes('/PhoneNumbers')) {
        return Promise.resolve([{ id: 123 }]);
      }
      return Promise.resolve([]);
    });
    const patchMock = jest.fn();
    const authenticateMock = jest.fn(() =>
      Promise.resolve({ token: 'foo', rockCookie: 'bar' })
    );

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.patch = patchMock;
    context.dataSources.Auth.authenticate = authenticateMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot(
      'try and find phone number / find user login'
    );
    expect(patchMock.mock.calls).toMatchSnapshot('update person id on login');
    expect(authenticateMock.mock.calls).toMatchSnapshot('login user');
  });

  it('registers a new user via their phone number and pin', async () => {
    const query = `
      mutation {
        registerWithSms(phoneNumber: "5133061126", pin: "123456", userProfile: [{ field: FirstName, value: "Burke" }, { field: LastName, value: "Shartsis" }]) {
          token
        }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn((path) => {
      if (path.includes('/PhoneNumbers')) {
        return Promise.resolve([]);
      }
      return Promise.resolve([{ id: 123 }]);
    });
    const patchMock = jest.fn();
    const authenticateMock = jest.fn(() =>
      Promise.resolve({ token: 'foo', rockCookie: 'bar' })
    );
    const postMock = jest.fn();
    const createUserProfileMock = jest.fn(() => Promise.resolve(123));

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.patch = patchMock;
    context.dataSources.AuthSms.post = postMock;
    context.dataSources.Auth.authenticate = authenticateMock;
    context.dataSources.Auth.createUserProfile = createUserProfileMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot(
      'try and find phone number / find user login'
    );
    expect(patchMock.mock.calls).toMatchSnapshot('update person id on login');
    expect(authenticateMock.mock.calls).toMatchSnapshot('login user');
    expect(postMock.mock.calls).toMatchSnapshot('create new phone number');
    expect(createUserProfileMock.mock.calls).toMatchSnapshot(
      'create user profile'
    );
  });

  it('registers a new user via their phone number, pin, and gender', async () => {
    const query = `
      mutation {
        registerWithSms(
          phoneNumber: "5133061126",
          pin: "123456",
          userProfile: [
            { field: FirstName, value: "Burke" },
            { field: LastName, value: "Shartsis" },
            { field: Gender, value: "Male" }
          ]
         ) {
          token
        }
      }
    `;
    const rootValue = {};

    const getMock = jest.fn((path) => {
      if (path.includes('/PhoneNumbers')) {
        return Promise.resolve([]);
      }
      return Promise.resolve([{ id: 123 }]);
    });
    const patchMock = jest.fn();
    const authenticateMock = jest.fn(() =>
      Promise.resolve({ token: 'foo', rockCookie: 'bar' })
    );
    const postMock = jest.fn();
    const createUserProfileMock = jest.fn(() => Promise.resolve(123));

    context.dataSources.AuthSms.get = getMock;
    context.dataSources.AuthSms.patch = patchMock;
    context.dataSources.AuthSms.post = postMock;
    context.dataSources.Auth.authenticate = authenticateMock;
    context.dataSources.Auth.createUserProfile = createUserProfileMock;

    const result = await graphql(schema, query, rootValue, context);
    expect(result).toMatchSnapshot();
    expect(getMock.mock.calls).toMatchSnapshot(
      'try and find phone number / find user login'
    );
    expect(patchMock.mock.calls).toMatchSnapshot('update person id on login');
    expect(authenticateMock.mock.calls).toMatchSnapshot('login user');
    expect(postMock.mock.calls).toMatchSnapshot('create new phone number');
    expect(createUserProfileMock.mock.calls).toMatchSnapshot(
      'create user profile'
    );
  });
});
