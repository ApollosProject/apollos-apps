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

  app.get('/app-link/*', (req, res) => {
    if (/Android/.test(req.headers['user-agent'])) {
      res.redirect(createRedirectLink({ platform: 'android', req }));
    } else {
      res.redirect(createRedirectLink({ platform: 'ios', req }));
    }
  });
}
