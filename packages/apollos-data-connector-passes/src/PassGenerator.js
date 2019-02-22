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
  // Most of this is copy-pasta'd from https://github.com/alexandercerutti/passkit-generator/blob/next/src/pass.js
  _patch(passBuffer) {
    let passFile = {};
    try {
      passFile = JSON.parse(passBuffer.toString('utf8'));
    } catch (e) {} // eslint-disable-line

    if (Object.keys(this._props).length) {
      if (this.shouldOverwrite) {
        Object.assign(passFile, this._props);
      } else {
        Object.keys(this._props).forEach((prop) => {
          if (passFile[prop]) {
            if (passFile[prop] instanceof Array) {
              passFile[prop].push(...this._props[prop]);
            } else if (passFile[prop] instanceof Object) {
              Object.assign(passFile[prop], this._props[prop]);
            }
          } else {
            passFile[prop] = this._props[prop];
          }
        });
      }
    }

    this._fields.forEach((area) => {
      if (this[area].fields.length) {
        if (this.shouldOverwrite) {
          passFile[this.type][area] = this[area].fields;
        } else {
          passFile[this.type][area].push(...this[area].fields);
        }
      }
    });

    if (this.type === 'boardingPass' && !this.transitType) {
      throw new Error('Transit Type is required');
    }

    if (this.transitType && passFile[this.type])
      passFile[this.type].transitType = this.transitType;

    return Buffer.from(JSON.stringify(passFile));
  }

  // Similar case here. We're just going to allow all types, because we can't reliably parse the pass template yet.
  _validateType = () => true;
}

export default ApollosPassGenerator;
