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

  // Unfortunately, we need to overwrite this method because of how we allow for Lava templated pass files
  // Essentially, all that this does is it tries to read the pass template as JSON, and if it fails,
  // it drops it and continues with just overwrite properties
  _patch(passBuffer) {
    try {
      JSON.parse(passBuffer.toString('utf8'));
      return super._patch(passBuffer);
    } catch (e) {
      // without a 'type', the super function will throw an error here:
      // https://github.com/alexandercerutti/passkit-generator/blob/master/src/pass.js#L652
      return super._patch(Buffer.from(JSON.stringify({ generic: {} })));
    }
  }

  // Similar case here. We're just going to allow all types, because we can't reliably parse the pass template yet.
  _validateType = () => {
    // TODO: in the future, we might want to support more than the generic type.
    this.type = 'generic';
    return true;
  };
}

export default ApollosPassGenerator;
