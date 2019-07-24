import React from 'react';
import { renderWithApolloData } from '../../utils/testUtils';
import BrowserWithUserCookie, { WITH_USER_COOKIE } from '../index';

describe('the BrowserWithUserCookie component', () => {
  beforeAll(() => {
    const mocks = [
      {
        request: { query: { WITH_USER_COOKIE } },
        response: {
          data: { currentUser: { id: 'User:123', rockToken: 'ABC' } },
        },
      },
    ];
  });
  it('renders', () => {
    expect(renderWithApolloData(<BrowserWithUserCookie />));
  });
});
