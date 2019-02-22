const ApolloServer = require.requireActual('@apollosproject/config').default;

// These example certs and private key were taken from easily found public examples on the web.
// I know not what they actaully represent!
const examplePem =
  '\n-----BEGIN CERTIFICATE-----\nMIICMzCCAZygAwIBAgIJALiPnVsvq8dsMA0GCSqGSIb3DQEBBQUAMFMxCzAJBgNV\nBAYTAlVTMQwwCgYDVQQIEwNmb28xDDAKBgNVBAcTA2ZvbzEMMAoGA1UEChMDZm9v\nMQwwCgYDVQQLEwNmb28xDDAKBgNVBAMTA2ZvbzAeFw0xMzAzMTkxNTQwMTlaFw0x\nODAzMTgxNTQwMTlaMFMxCzAJBgNVBAYTAlVTMQwwCgYDVQQIEwNmb28xDDAKBgNV\nBAcTA2ZvbzEMMAoGA1UEChMDZm9vMQwwCgYDVQQLEwNmb28xDDAKBgNVBAMTA2Zv\nbzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAzdGfxi9CNbMf1UUcvDQh7MYB\nOveIHyc0E0KIbhjK5FkCBU4CiZrbfHagaW7ZEcN0tt3EvpbOMxxc/ZQU2WN/s/wP\nxph0pSfsfFsTKM4RhTWD2v4fgk+xZiKd1p0+L4hTtpwnEw0uXRVd0ki6muwV5y/P\n+5FHUeldq+pgTcgzuK8CAwEAAaMPMA0wCwYDVR0PBAQDAgLkMA0GCSqGSIb3DQEB\nBQUAA4GBAJiDAAtY0mQQeuxWdzLRzXmjvdSuL9GoyT3BF/jSnpxz5/58dba8pWen\nv3pj4P3w5DoOso0rzkZy2jEsEitlVM2mLSbQpMM+MUVQCQoiG6W9xuCFuxSrwPIS\npAqEAuV4DNoxQKKWmhVv+J0ptMWD25Pnpxeq5sXzghfJnslJlQND\n-----END CERTIFICATE-----';
const examplePrivateKey =
  '-----BEGIN RSA PRIVATE KEY-----\nProc-Type: 4,ENCRYPTED\nDEK-Info: DES-EDE3-CBC,E3B1C06E0D0C2633\n\ngvmXzl6W7eV1a3N5rQNwBWKY9on3IgxZudS33cip5f88FotsPSDJMvqj6LVw2RxobDjhlOOzqmTb\nVrlTnoQ6CogXFZSfiPmixiyyptCUEKJkSiEhYGM5GQm0OoGcLeLbgBb9tRpWh5IlXulKD6XFhx8q\n/eGg5a+mSkX1i7kv2+Ih3jHmEKwrnfzhcA29pBF3OQJo+Ks9IYneuk676pHtsIs7CpFKq1tDvD8Q\nO7URxnVnHLltaFvIxshqyZu92xbUYZR7YzjXl5+3w4TVgeAHUogEV+H9iZTosD/copUsbQO+78w2\nE1D3iDS94wRgx0Tjv4xlwrTpOV38FS5rdL32492DcCRlCYM4VtuwjYeWi5shJg69jCb0EwGRqfAo\nxko+lbKWELTuFKwD7n1rc/2fTarbGuf8S2AEggBLZyfXHC/9N84mXLFO2XKq+0WdiEFhQj2Cze+a\n9qcSK6tPSrjK1LPlnOOppFgDElZaZ0rxsgjtiWSIAEw/Ad+SIM5u+vqwzF8J317JlsdKoBFDw8mS\nMxCMuMksKJ23mgvY+THRIVgH3E7lEDZQzCi1Uy6ldLJcran/6wHwP88pVM2odiHkpnrJGcEBbbIk\nqsxJZhFT8aUt/cUEBj3fnP7cxoNLQfTHMPqUTqKBWaVufFzGU9YB1R+XWFULLddwJHnV7gPheBlk\nMDapowb+Is77+a9Y2VDsOXEvNpqTY0giiSrckG05IZnrhJ24JnSCwyNd99lm7XKdEGGrjBCMqIyI\nFqox8Ahkv3KWAJPYK1eOCc5d/KwZHlnlFJq7ZYy9u3fEnxQCjOEmeXLkLangKA==\n-----END RSA PRIVATE KEY-----';

const privateKeyPassword = 'password';

ApolloServer.loadJs({
  APP: {
    ROOT_API_URL: 'http://localhost:4000',
  },
  PASS: {
    TEMPLATES: {
      EXAMPLE: `${process.env.PWD}/example-pass.pass`,
    },
    CERTIFICATES: {
      WWDR: examplePem,
      SIGNER_CERT: examplePem,
      SIGNER_KEY: examplePrivateKey,
      SIGNER_KEY_PASSPHRASE: privateKeyPassword,
    },
  },
  ROCK: {
    API_URL: 'https://apollosrock.newspring.cc/api',
    API_TOKEN: 'some-rock-token',
  },
});

export default ApolloServer;
