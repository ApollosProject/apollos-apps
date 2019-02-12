import { Pass } from 'passkit-generator';
import ApollosConfig from '@apollosproject/config';

class ApollosPassGenerator extends Pass {
  constructor(options) {
    super({
      certificates: {
        wwdr: ApollosConfig.PASS.CERTIFICATES.WWDR,
        signerCert: ApollosConfig.PASS.CERTIFICATES.SIGNER_CERT,
        signerKey: {
          keyFile: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY,
          passphrase: ApollosConfig.PASS.CERTIFICATES.SIGNER_KEY_PASSPHRASE,
        },
      },
      ...options,
    });
  }
}

export default ApollosPassGenerator;
