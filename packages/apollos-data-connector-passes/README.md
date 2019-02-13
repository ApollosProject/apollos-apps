# `apollos-data-connector-passes`

Create Apple PassKit passes and expose pass data over graphql!

## Usage

This readme is in-progress, but here are the basics to help get you going:

#### Add `apollos-data-connector-passes` to your Apollos API

#### Setup your Apple certificates

We don't have a guide for this yet, but here's enough info to get you started:

1. Follow [these instructions](https://github.com/alexandercerutti/passkit-generator#certificates) to generate your certificate files
2. Once you have your certificate files, you'll need to turn each of these certificates into a string and add them as an env var, like this:

```bash
PASS_WWDR_CERT="-----BEGIN CERTIFICATE-----\nMII ... and so on"
PASS_SIGNER_CERT="Bag Attributes\n    friendlyName: Pass Type ID: pass.com.apollos.testing\n  ... and so on"
PASS_SIGNER_KEY="Bag Attributes\n    friendlyName: Conrad VanLandingham Apollos Testing Key\n  ... and so on"
PASS_SIGNER_PASSPHRASE=somepassword
```

Basically, you turn the certificate into a single line, and add a `\n` char at the end of each line.

#### Create a pass template

An example is available in the `example-pass.pass` folder. This folder structure follows the same [structure define by Apple](https://developer.apple.com/library/archive/documentation/UserExperience/Reference/PassKit_Bundle/Chapters/Introduction.html#//apple_ref/doc/uid/TP40012026-CH0-SW1), with two added features:

1. You can add Lava to your pass.json files. `person` is an available variable, and references who the pass is for.
2. You can add dynamic or remote image fields. An example is with the `thumbnail` key in `example-pass.pass`. These fields are outside of the Apple specs, and can be used for `icon`, `logo`, and `thumbnail`. You can also provide `@2x` versions.

Once you've added your template, you'll want to make sure your `config.yml` references your certificates and your template:

```yaml
PASS:
  TEMPLATES:
    CHECKIN: ${PWD}/wallet-passes/checkin.pass
  CERTIFICATES:
    WWDR: ${PASS_WWDR_CERT}
    SIGNER_CERT: ${PASS_SIGNER_CERT}
    SIGNER_KEY: ${PASS_SIGNER_KEY}
    SIGNER_KEY_PASSPHRASE: ${PASS_SIGNER_PASSPHRASE}
```

#### Query for your pass data over graphql

```gql
query {
  userPasses {
    id
    type
    description
    logo { uri }
    thumbnail { uri }
    barcode { uri }
    primaryFields {
      key
      label
      value
      textAlignment
    }
    secondaryFields {
      key
      label
      value
      textAlignment
    }
    backgorundColor
    foregroundColor
    labelColor
    logoText
    passkitFileUrl
  }
}
```

#### Download the pass

Pass files can be downloaded via a GET request to `http://your-server-url/pass/TEMPLATENAME`. Make sure you set an `Authorization` header with a valid user auth token.