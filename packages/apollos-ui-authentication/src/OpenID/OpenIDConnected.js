import React, { useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { SkipButton } from '../styles';
import { LoginContext } from '../LoginProvider';
import OpenID from './OpenID';

const OPENID_PROVIDERS_QUERY = gql`
  query openIdProviders {
    openIdProviders {
      authorizationUrl
      providerType
    }
  }
`;

const CONNECT_OPENID = gql`
  mutation connectOpenId($code: String!, $providerType: String!) {
    connectOpenId(code: $code, providerType: $providerType) {
      success
    }
  }
`;

// the whatwg polyfill that ships w/ RN is broken :/
// https://github.com/facebook/react-native/issues/23922
const getSearchParamFromURL = (url, param) => {
  const include = url.includes(param);

  if (!include) return null;

  const params = url.split(/([?,=])/);
  const index = params.indexOf(param);
  const value = params[index + 2];
  return value;
};

const OpenIDConnected = ({ provider = 'rock', navigation }) => {
  const { closeAuth } = React.useContext(LoginContext);

  const { data } = useQuery(OPENID_PROVIDERS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const [error, setError] = useState(false);

  const [connectOpenId] = useMutation(CONNECT_OPENID);

  const openIdProvider = (data?.openIdProviders || []).find(
    (p) => p.providerType === provider
  );

  const handleRequestOpenIdConnect = async () => {
    setError(false);
    const result = await InAppBrowser.openAuth(openIdProvider.authorizationUrl);
    if (result.type === 'success') {
      const code = getSearchParamFromURL(result.url, 'code');

      try {
        const { data: connectResult } = await connectOpenId({
          variables: { code, providerType: openIdProvider.providerType },
        });
        if (connectResult.connectOpenId.success) {
          closeAuth();
        }
        throw new Error('Failed to connect via OpenID')        
      } catch {
        setError(true);
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/display-name
      headerRight: () => (
        <SkipButton
          onPress={() => navigation.navigate('AuthProfileEntryConnected')}
        >
          Skip
        </SkipButton>
      ),
    });
  }, [navigation]);

  return <OpenID onRequestOpenIdConnect={handleRequestOpenIdConnect} error={error} />;
};

OpenIDConnected.propTypes = {
  provider: PropTypes.string,
};

export default OpenIDConnected;
