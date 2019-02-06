import { Pass } from 'passkit-generator';
import ApollosConfig from '@apollosproject/config';
import resolver from './resolver';
import dataSource from './data-source';

export { resolver, dataSource };
export { passSchema as schema } from '@apollosproject/data-schema';

const serverMiddleware = ({ app }) => {
  app.get('/pass', (req, res) => {
    console.log({
      model: ApollosConfig.PASS.TEMPLATE,
      certificates: {
        wwdr: ApollosConfig.PASS.CERTIFICATES.WWDR,
        signerCert: ApollosConfig.PASS.CERTIFICATES.SIGNER_CERT,
        signerKey: {
          keyFile: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY,
          passphrase: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY_PASSPHRASE,
        },
      },
    });
    const pass = new Pass({
      model: ApollosConfig.PASS.TEMPLATE,
      certificates: {
        wwdr: ApollosConfig.PASS.CERTIFICATES.WWDR,
        signerCert: ApollosConfig.PASS.CERTIFICATES.SIGNER_CERT,
        signerKey: {
          keyFile: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY,
          passphrase: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY_PASSPHRASE,
        },
      },
    });
    res.send('hello-world');
  });
};

export { serverMiddleware };
