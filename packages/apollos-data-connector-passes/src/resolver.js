import url from 'url';
import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { camelCase } from 'lodash';
import QRCode from 'qrcode';

// Gets a list of supported pass types according to the graph schema
const getSupportedPassTypes = (schema) => {
  const { values = [] } = schema.getTypeMap().PassType.astNode;
  return values.map(({ name }) => name.value);
};

// Returns pass type... ex: 'GENERIC'
const getPassType = ({ pass, schema }) => {
  const types = getSupportedPassTypes(schema);
  return types.find((type) =>
    Object.hasOwnProperty.call(pass, camelCase(type))
  );
};

const getPassStyleFields = ({ pass, schema }) => {
  const type = getPassType({ pass, schema });
  return pass[camelCase(type)];
};

export default {
  Query: {
    userPass: async (a, b, context) => {
      const templates = Object.keys(ApollosConfig.PASS.TEMPLATES);
      if (!templates.length) return [];

      const defaultPassTemplate = templates[0];
      const defaultPass = await context.dataSources.Pass.generatePassData({
        template: defaultPassTemplate,
      });
      return defaultPass;
    },
  },
  Pass: {
    id: ({ template }, args, context, { parentType }) =>
      createGlobalId(template, parentType.name),
    type: (pass, args, context, { schema }) =>
      // the type is detected by which set of "style key" is provided in the template,
      // according to Apple docs: https://developer.apple.com/library/archive/documentation/UserExperience/Reference/PassKit_Bundle/Chapters/TopLevel.html#//apple_ref/doc/uid/TP40012026-CH2-SW1
      getPassType({ pass, schema }),
    barcode: async ({ barcodes = [] }) => {
      if (!barcodes.length) return null;

      const supportedType = 'PKBarcodeFormatQR';
      const { message } =
        barcodes.find(({ format }) => format === supportedType) || {};
      if (!message) return null;

      const uri = await QRCode.toDataURL(message);

      return { uri };
    },
    primaryFields: (pass, args, context, { schema }) => {
      const styleFields = getPassStyleFields({ pass, schema }) || {};
      return styleFields.primaryFields;
    },
    secondaryFields: (pass, args, context, { schema }) => {
      const styleFields = getPassStyleFields({ pass, schema }) || {};
      return styleFields.secondaryFields;
    },
    passkitFileUrl: ({ template }) =>
      url.resolve(ApollosConfig.APP.ROOT_API_URL, `pass/${template}`),
  },
  PassField: {
    textAlignment: ({ textAlignment }) => {
      switch (textAlignment) {
        case 'PKTextAlignmentRight':
          return 'RIGHT';
        case 'PKTextAlignmentCenter':
          return 'CENTER';
        case 'PKTextAlignmentNatural':
          return 'NATURAL';
        case 'PKTextAlignmentLeft':
        default:
          return 'LEFT';
      }
    },
  },
};
