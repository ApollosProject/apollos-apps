import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// React native doesn't support urlSearchParams.get :/
function getParameterByName(paramName, url) {
  const fixedName = paramName.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${fixedName}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const LoginContext = React.createContext({
  authType: null,
  userProfile: {},
  newUser: false,
});

const LoginProvider = ({ children, closeAuth }) => {
  const [authType, setAuthType] = useState('phone');
  const [newUser, setNewUser] = useState(true);
  const [identity, setIdentity] = useState();
  const [code, setCode] = useState();

  const handleUrl = (url) => {
    if (url) {
      const urlIdentity = getParameterByName('identity', url);
      const urlCode = getParameterByName('code', url);
      const urlAuthType = getParameterByName('authType', url);
      if (urlCode) setCode(urlCode);
      if (urlAuthType) setAuthType(urlAuthType);
      if (urlIdentity && urlAuthType)
        setIdentity({ [urlAuthType]: urlIdentity });
    }
  };

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      handleUrl(url);
    });
    const listener = Linking.addEventListener('url', ({ url }) =>
      handleUrl(url)
    );

    return listener.remove;
  }, []);

  const toggleAuthType = () => {
    setAuthType((currAuthType) =>
      currAuthType === 'email' ? 'phone' : 'email'
    );
  };

  const [requestLogin] = useMutation(gql`
    mutation requestLogin($identity: AuthenticationIdentityInput!) {
      requestLogin(identity: $identity) {
        result
      }
    }
  `);

  const [requestRegister] = useMutation(gql`
    mutation requestRegister($identity: AuthenticationIdentityInput!) {
      requestRegister(identity: $identity) {
        result
      }
    }
  `);
  const [validateLogin] = useMutation(gql`
    mutation validateLogin(
      $identity: AuthenticationIdentityInput!
      $otp: String!
    ) {
      validateLogin(identity: $identity, otp: $otp) {
        refreshToken
        accessToken
      }
    }
  `);

  const [requestOpenIdRegister] = useMutation(gql`
    mutation requestOpenIdRegister($code: String!, $providerType: String!) {
      requestOpenIdRegister(code: $code, providerType: $providerType) {
        refreshToken
        accessToken
      }
    }
  `);

  const [requestConnectIdentity] = useMutation(gql`
    mutation requestConnectIdentity($input: AuthenticationIdentityInput!) {
      requestConnectIdentity(identity: $input) {
        result
      }
    }
  `);

  const [connectIdentity] = useMutation(gql`
    mutation connectIdentity(
      $identity: AuthenticationIdentityInput!
      $otp: String!
    ) {
      connectIdentity(identity: $identity, otp: $otp) {
        person {
          id
          phone
          email
        }
      }
    }
  `);

  const handleRequestLogin = async ({ identity: idty }) => {
    setIdentity(idty);

    const identityInput = { [authType]: idty[authType] };

    // hack until our backend supports this better
    if (identityInput.phone) {
      identityInput.phone = `1${identityInput.phone}`;
    }

    const { data } = await requestLogin({
      variables: { identity: identityInput },
    });
    return data.requestLogin;
  };

  const handleRequestRegister = async ({ identity: idty }) => {
    setIdentity(idty);

    const identityInput = { [authType]: idty[authType] };

    // hack until our backend supports this better
    if (identityInput.phone) {
      identityInput.phone = `1${identityInput.phone}`;
    }

    const { data } = await requestRegister({
      variables: { identity: identityInput },
    });
    return data.requestRegister;
  };

  const handleRequestConnectIdentity = async ({
    identity: idty,
    identityType,
  }) => {
    setIdentity(idty);

    const identityInput = { [identityType]: idty[identityType] };

    const { data } = await requestConnectIdentity({
      variables: { input: identityInput },
    });
    return data.requestConnectIdentity;
  };

  const handleConnectIdentity = async ({ code: otp }) => {
    const identityInput = { [authType]: identity[authType] };

    const { data } = await connectIdentity({
      variables: { identity: identityInput, otp },
    });

    return data.connectIdentity;
  };

  const handleValidateLogin = async ({ code: otp }) => {
    const identityInput = { [authType]: identity[authType] };

    // hack until our backend supports this better
    if (identityInput.phone) {
      identityInput.phone = `1${identityInput.phone}`;
    }

    const { data } = await validateLogin({
      variables: { identity: identityInput, otp },
    });

    return data.validateLogin;
  };

  const handleRequestOpenIdRegister = async ({
    code: openIdCode,
    providerType,
  }) => {
    const { data } = await requestOpenIdRegister({
      variables: { code: openIdCode, providerType },
    });

    return data.requestOpenIdRegister;
  };

  return (
    <LoginContext.Provider
      value={{
        authType,
        identity,
        newUser,
        setNewUser,
        toggleAuthType,
        setIdentity,
        handleRequestLogin,
        handleRequestRegister,
        handleValidateLogin,
        handleRequestConnectIdentity,
        handleConnectIdentity,
        handleRequestOpenIdRegister,
        closeAuth,
        code,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

LoginProvider.propTypes = {
  closeAuth: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
};

const { Consumer } = LoginContext;

export { LoginProvider, Consumer as LoginConsumer };
