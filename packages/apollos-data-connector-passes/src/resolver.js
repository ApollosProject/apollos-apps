import ApollosConfig from '@apollosproject/config';
import { createGlobalId } from '@apollosproject/server-core';
import { camelCase } from 'lodash';

const getSupportedPassTypes = (schema) => {
  const { values = [] } = schema.getTypeMap().PassType.astNode;
  return values.map(({ name }) => name.value);
};

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
    userPasses: async (a, b, context) => {
      const templates = Object.keys(ApollosConfig.PASS.TEMPLATES);
      if (!templates.length) return [];

      const defaultPassTemplate = templates[0];
      const defaultPass = await context.dataSources.Passes.generatePassData({
        template: defaultPassTemplate,
      });
      return [defaultPass];
    },
  },
  Pass: {
    id: (pass, args, context, { parentType }) =>
      createGlobalId('pass', parentType.name),
    type: (pass, args, context, { schema }) =>
      // the type is detected by which set of "style key" is provided in the template,
      // according to Apple docs: https://developer.apple.com/library/archive/documentation/UserExperience/Reference/PassKit_Bundle/Chapters/TopLevel.html#//apple_ref/doc/uid/TP40012026-CH2-SW1
      getPassType({ pass, schema }),
    primaryFields: (pass, args, context, { schema }) => {
      const styleFields = getPassStyleFields({ pass, schema }) || {};
      return styleFields.primaryFields;
    },
    secondaryFields: (pass, args, context, { schema }) => {
      const styleFields = getPassStyleFields({ pass, schema }) || {};
      return styleFields.secondaryFields;
    },
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
