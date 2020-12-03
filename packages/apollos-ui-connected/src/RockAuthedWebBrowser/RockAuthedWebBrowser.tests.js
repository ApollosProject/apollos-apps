import React from 'react';
import renderer from 'react-test-renderer';
import { Platform } from 'react-native';

import { Touchable } from '@apollosproject/ui-kit';

import { Providers } from '@apollosproject/ui-test-utils';
import { MockedProvider } from '@apollo/client/testing';

import RockAuthedWebBrowser from '.';

describe(`RockAuthedWebBrowser Consumer`, () => {
  it('passes a function', async () => {
    renderer.create(
      <Providers MockedProvider={MockedProvider}>
        <RockAuthedWebBrowser>
          {(openUrl) => {
            expect(typeof openUrl).toBe('function');
            return (
              <Touchable
                onPress={() =>
                  openUrl('https://apollosrock.newspring.cc/page/235')
                }
              />
            );
          }}
        </RockAuthedWebBrowser>
      </Providers>
    );
  });
  it('passes a function (Android)', async () => {
    Platform.OS = 'android';
    renderer.create(
      <Providers MockedProvider={MockedProvider}>
        <RockAuthedWebBrowser>
          {(openUrl) => {
            expect(typeof openUrl).toBe('function');
            return (
              <Touchable
                onPress={() =>
                  openUrl('https://apollosrock.newspring.cc/page/235')
                }
              />
            );
          }}
        </RockAuthedWebBrowser>
      </Providers>
    );
  });
});
