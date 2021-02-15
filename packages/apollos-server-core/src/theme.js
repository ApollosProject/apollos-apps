import { themeSchema as schema } from '@apollosproject/data-schema';

import { GraphQLScalarType } from 'graphql';
import color from 'color';

const resolver = {
  Theme: {
    type: () => null,
    colors: () => {
      return {
        primary: null,
        secondary: null,
      };
    },
  },
  Color: new GraphQLScalarType({
    name: 'Color',
    description: 'A rgb color string',
    serialize(value) {
      return color(value).rgb().string();
    },
    parseValue(value) {
      return color(value);
    },
    parseLiteral({ value }) {
      return color(value);
    },
  }),
};

export { schema, resolver };
