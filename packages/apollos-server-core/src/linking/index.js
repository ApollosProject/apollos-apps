/* eslint-disable import/prefer-default-export */
import { fetchChurchConfig } from '@apollosproject/config';

const defaultCreateRedirectLink = ({ platform, Config }) => {
  if (platform === 'android') {
    return Config.UNIVERSAL_LINKS.PLAY_STORE_LINK;
  }
  return Config.UNIVERSAL_LINKS.APP_STORE_LINK;
};

export function setupUniversalLinks({
  app,
  assetLinks = {},
  appleAppSiteAssociation = {},
  // Rather than redirecting to the app store, clients can override this function
  // to redirect to their content on the web.
  createRedirectLink = defaultCreateRedirectLink,
  getContext,
}) {
  app.get('/.well-known/apple-app-site-association', async (req, res) => {
    const context = await getContext({ req });
    const Config = await fetchChurchConfig({
      churchSlug: context.church?.slug,
    });
    const { APPLE_TEAM_ID, APPLE_APP_ID } = Config.UNIVERSAL_LINKS;
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify({
        applinks: {
          apps: [],
          details: [
            {
              appID: [APPLE_TEAM_ID, APPLE_APP_ID].join('.'),
              paths: ['/app-link/*'],
            },
          ],
        },
        ...appleAppSiteAssociation,
      })
    );
  });

  app.get('/.well-known/assetlinks.json', async (req, res) => {
    const context = await getContext({ req });
    const Config = await fetchChurchConfig({
      churchSlug: context.church?.slug,
    });
    const { GOOGLE_APP_ID, GOOGLE_KEYSTORE_SHA256 } = Config.UNIVERSAL_LINKS;
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify([
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: GOOGLE_APP_ID,
            sha256_cert_fingerprints: [GOOGLE_KEYSTORE_SHA256],
          },
          ...assetLinks,
        },
      ])
    );
  });

  app.get('/app-link/*', async (req, res) => {
    const context = await getContext({ req });
    const Config = await fetchChurchConfig({
      churchSlug: context.church?.slug,
    });
    if (/Android/.test(req.headers['user-agent'])) {
      const link = await createRedirectLink({
        platform: 'android',
        req,
        Config,
      });
      res.redirect(link);
    } else {
      const link = await createRedirectLink({ platform: 'ios', req, Config });
      res.redirect(link);
    }
  });
}

export const generateAppLink = (
  type = 'universal',
  route = 'nav',
  args = { screen: 'home' },
  Config
) => {
  const TYPES = ['universal', 'deep'];
  const ROUTES = ['content', 'nav', 'auth'];
  const SCREENS = ['home', 'read', 'watch', 'pray', 'connect'];

  if (!TYPES.includes(type))
    throw new Error(`Must select link type from ${TYPES}`);
  if (!ROUTES.includes(route))
    throw new Error(`Must select link route from ${ROUTES}`);
  if (route === 'content' && !args.contentID)
    throw new Error('Must pass args.contentID with content route link');
  if (route === 'nav' && !SCREENS.includes(args.screen))
    throw new Error(`Must select screen from ${SCREENS} with nav route link`);

  const host = {
    universal: `${Config.APP.UNIVERSAL_LINK_HOST}/app-link/`,
    deep: `${Config.APP.DEEP_LINK_HOST}://app-link/`,
  };

  const path = {
    content: args.contentID,
    nav: args.screen,
    auth: args.query,
  };

  // path is arbitrary and is handled app side
  // this just provides structure so the app can expect the same thing every time
  return `${host[type]}${route}/${path[route]}`;
};

export { setupUniversalLinks as serverMiddleware };
