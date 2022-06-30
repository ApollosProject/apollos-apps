import URL from 'url';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { LoginContext } from '../LoginProvider';
import { AuthContext } from '../Provider';
import AuthLanding from './AuthLanding';

const OPENID_PROVIDERS_QUERY = gql`
  query openIdProviders {
    openIdProviders {
      authorizationUrl
      providerType
    }
  }
`;

// the whatwg polyfill that ships w/ RN is broken :/
// https://github.com/facebook/react-native/issues/23922
const getSearchParamFromURL = (url, param) => {
  const include = url.includes(param);

  if (!include) {
    return null;
  }

  const params = url.split(/([?,=])/);
  const index = params.indexOf(param);
  const value = params[index + 2];
  return value;
};

const AuthLandingConnected = ({ provider = 'rock', navigation }) => {
  const { handleRequestOpenIdRegister } = React.useContext(LoginContext);
  const { login } = React.useContext(AuthContext);

  const { data } = useQuery(OPENID_PROVIDERS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const [error, setError] = useState(false);

  const openIdProvider = (data?.openIdProviders || []).find(
    (p) => p.providerType === provider
  );

  const handleRegisterWithOpenId = async () => {
    setError(false);
    const result = await InAppBrowser.openAuth(openIdProvider.authorizationUrl);
    if (result.type === 'success') {
      const code = getSearchParamFromURL(result.url, 'code');

      try {
        const openIdResult = await handleRequestOpenIdRegister({
          code,
          providerType: provider,
        });
        if (openIdResult.accessToken && openIdResult.refreshToken) {
          await login({
            accessToken: openIdResult.accessToken,
            refreshToken: openIdResult.refreshToken,
          });
          navigation.navigate('IdentityConnectConnected');
        } else {
          throw new Error('Failed to connect via OpenID');
        }
      } catch (e) {
        console.log(e);
        setError(true);
      }
    }
  };

  return (
    <AuthLanding
      onRegisterWithOpenId={handleRegisterWithOpenId}
      providerFriendlyName={
        URL.parse(openIdProvider?.authorizationUrl || '')?.hostname
      }
      demoUrl={`https://${
        URL.parse(openIdProvider?.authorizationUrl || '')?.hostname
      }`}
      error={error}
    />
  );
};

AuthLandingConnected.propTypes = {
  provider: PropTypes.string,
};

export default AuthLandingConnected;
