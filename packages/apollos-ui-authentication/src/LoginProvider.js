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
