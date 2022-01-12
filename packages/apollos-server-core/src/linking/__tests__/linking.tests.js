// import { dataSource as ConfigDataSource } from '@apollosproject/config';
import {
  dataSource as ConfigDataSource,
  fetchChurchConfig,
} from '@apollosproject/config';
import { setupUniversalLinks, generateAppLink } from '../index';
import { createTestHelpers } from '../../testUtils';

const { getContext } = createTestHelpers({
  Config: { dataSource: ConfigDataSource },
});

const req = {
  headers: {
    'x-church': 'apollos-demo',
  },
};

describe('Universal linking', () => {
  it('apple-app-site-association should return the correct values', () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { setHeader: jest.fn(), send: jest.fn() };

    setupUniversalLinks({ app, getContext });
    fns['/.well-known/apple-app-site-association'](req, res);

    expect(res.setHeader.mock.calls).toMatchSnapshot();
    expect(res.send.mock.calls).toMatchSnapshot();
  });
  it('apple-app-site-association should handle custom values', () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { setHeader: jest.fn(), send: jest.fn() };

    setupUniversalLinks({
      app,
      appleAppSiteAssociation: { someOtherKey: 'value ' },
      getContext,
    });
    fns['/.well-known/apple-app-site-association'](req, res);

    expect(res.setHeader.mock.calls).toMatchSnapshot();
    expect(res.send.mock.calls).toMatchSnapshot();
  });

  it('assetlinks.json should return the correct values', () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { setHeader: jest.fn(), send: jest.fn() };

    setupUniversalLinks({ app, getContext });
    fns['/.well-known/assetlinks.json'](req, res);

    expect(res.setHeader.mock.calls).toMatchSnapshot();
    expect(res.send.mock.calls).toMatchSnapshot();
  });

  it('assetlinks.json should handle custom values', () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { setHeader: jest.fn(), send: jest.fn() };

    setupUniversalLinks({
      app,
      assetLinks: { someOtherKey: 'value' },
      getContext,
    });
    fns['/.well-known/assetlinks.json'](req, res);

    expect(res.setHeader.mock.calls).toMatchSnapshot();
    expect(res.send.mock.calls).toMatchSnapshot();
  });

  it('default to sending app links to the app store', async () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { redirect: jest.fn() };

    setupUniversalLinks({ app, getContext });
    await fns['/app-link/*'](req, res);

    expect(res.redirect.mock.calls[0][0]).toBe('app-store-link');
  });

  it('default to sending android browsers to the play store', async () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { redirect: jest.fn() };

    setupUniversalLinks({ app, getContext });
    await fns['/app-link/*'](
      {
        headers: {
          'x-church': 'apollos_demo',
          'user-agent':
            'Mozilla/5.0 (Linux; U; Android 2.2) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1',
        },
      },
      res
    );

    expect(res.redirect.mock.calls[0][0]).toBe('play-store-link');
  });

  it('can send users to a link determined by a custom function', async () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { redirect: jest.fn() };

    const createRedirectLink = jest.fn(() => 'return-url');

    setupUniversalLinks({ app, createRedirectLink, getContext });
    await fns['/app-link/*'](
      {
        headers: {
          'x-church': 'apollos_demo',
        },
        path: 'some-path-value',
      },
      res
    );

    expect(res.redirect.mock.calls[0][0]).toBe('return-url');
    expect(createRedirectLink.mock.calls).toMatchSnapshot();
  });

  it('generates a universal nav link to home', () => {
    const Config = fetchChurchConfig();
    expect(
      generateAppLink('universal', 'nav', { screen: 'home' }, Config)
    ).toMatchSnapshot();
  });
  it('generates a universal nav link to the connect screen', () => {
    const Config = fetchChurchConfig();
    expect(
      generateAppLink('universal', 'nav', { screen: 'connect' }, Config)
    ).toMatchSnapshot();
  });
  it('generates a deep content link', () => {
    const Config = fetchChurchConfig();
    expect(
      generateAppLink('deep', 'content', { contentID: '1' }, Config)
    ).toMatchSnapshot();
  });
});
