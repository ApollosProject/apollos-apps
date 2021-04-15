import ApollosConfig from '@apollosproject/config';
import { setupUniversalLinks, generateAppLink } from '../index';

ApollosConfig.loadJs({
  APP: {
    UNIVERSAL_LINK_HOST: 'https://apollos.api',
    DEEP_LINK_HOST: 'apolloschurchapp',
  },
  UNIVERSAL_LINKS: {
    APPLE_APP_ID: 'test_id',
    APPLE_TEAM_ID: 'test_team_id',
    APP_STORE_LINK: 'app-store-link',
    PLAY_STORE_LINK: 'play-store-link',
    GOOGLE_APP_ID: 'some_app_id',
    GOOGLE_KEYSTORE_SHA256: 'some-google-keystore',
  },
});

describe('Universal linking', () => {
  it('apple-app-site-association should return the correct values', () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { setHeader: jest.fn(), send: jest.fn() };

    setupUniversalLinks({ app });
    fns['/.well-known/apple-app-site-association'](null, res);

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
    });
    fns['/.well-known/apple-app-site-association'](null, res);

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

    setupUniversalLinks({ app });
    fns['/.well-known/assetlinks.json'](null, res);

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

    setupUniversalLinks({ app, assetLinks: { someOtherKey: 'value' } });
    fns['/.well-known/assetlinks.json'](null, res);

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

    setupUniversalLinks({ app });
    await fns['/app-link/*']({ headers: '' }, res);

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

    setupUniversalLinks({ app });
    await fns['/app-link/*'](
      {
        headers: {
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

    setupUniversalLinks({ app, createRedirectLink });
    await fns['/app-link/*']({ headers: '', path: 'some-path-value' }, res);

    expect(res.redirect.mock.calls[0][0]).toBe('return-url');
    expect(createRedirectLink.mock.calls).toMatchSnapshot();
  });

  it('generates a universal nav link to home', () => {
    expect(generateAppLink()).toMatchSnapshot();
  });
  it('generates a universal nav link to the connect screen', () => {
    expect(
      generateAppLink('universal', 'nav', { screen: 'connect' })
    ).toMatchSnapshot();
  });
  it('generates a deep content link', () => {
    expect(
      generateAppLink('deep', 'content', { contentID: '1' })
    ).toMatchSnapshot();
  });
});
