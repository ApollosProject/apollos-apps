/* eslint-disable import/prefer-default-export */
import ApollosConfig from '@apollosproject/config';

const defaultCreateRedirectLink = ({ platform }) => {
  if (platform === 'android') {
    return ApollosConfig.UNIVERSAL_LINKS.PLAY_STORE_LINK;
  }
  return ApollosConfig.UNIVERSAL_LINKS.APP_STORE_LINK;
};

export function setupUniversalLinks({
  app,
  assetLinks = {},
  appleAppSiteAssociation = {},
  // Rather than redirecting to the app store, clients can override this function
  // to redirect to their content on the web.
  createRedirectLink = defaultCreateRedirectLink,
}) {
  const {
    APPLE_TEAM_ID,
    APPLE_APP_ID,
    GOOGLE_APP_ID,
    GOOGLE_KEYSTORE_SHA256,
  } = ApollosConfig.UNIVERSAL_LINKS;

  app.get('/.well-known/apple-app-site-association', (req, res) => {
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

  app.get('/.well-known/assetlinks.json', (req, res) => {
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
    if (/Android/.test(req.headers['user-agent'])) {
      const link = await createRedirectLink({ platform: 'android', req });
      res.redirect(link);
    } else {
      const link = await createRedirectLink({ platform: 'ios', req });
      res.redirect(link);
    }
  });
}

export const generateAppLink = (
  type = 'universal',
  route = 'nav',
  args = { screen: 'home' }
) => {
  const TYPES = ['universal', 'deep'];
  const ROUTES = ['content', 'nav'];
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
    universal: `${ApollosConfig.APP.UNIVERSAL_LINK_HOST}/app-link/`,
    deep: `${ApollosConfig.APP.DEEP_LINK_HOST}://app-link/`,
  };

  const path = {
    content: args.contentID,
    nav: args.screen,
  };

  // path is arbitrary and is handled app side
  // this just provides structure so the app can expect the same thing every time
  return `${host[type]}${route}/${path[route]}`;
};
