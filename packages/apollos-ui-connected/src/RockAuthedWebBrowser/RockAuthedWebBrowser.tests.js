import React from 'react';
import renderer from 'react-test-renderer';
import { Platform } from 'react-native';

import { Providers } from '../utils/testUtils';

import { RockAuthedWebBrowserConsumer } from '.';

jest.mock('Platform');

describe(`WebBrowser Provider and Consumer`, () => {
  it('passes a function', async () => {
    renderer.create(
      <Providers>
        <RockAuthedWebBrowserConsumer>
          {(openUrl) => {
            expect(typeof openUrl).toBe('function');
          }}
        </RockAuthedWebBrowserConsumer>
      </Providers>
    );
  });
  it('passes a function (Android)', async () => {
    Platform.OS = 'android';
    renderer.create(
      <Providers>
        <RockAuthedWebBrowserConsumer>
          {(openUrl) => {
            expect(typeof openUrl).toBe('function');
          }}
        </RockAuthedWebBrowserConsumer>
      </Providers>
    );
  });
});
