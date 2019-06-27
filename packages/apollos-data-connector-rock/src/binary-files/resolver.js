export default {
  Person: {
    photo: async ({ photo }, args, { dataSources: { BinaryFiles } }) => ({
      uri: await BinaryFiles.findOrReturnImageUrl(photo), // protect against passing null photo
    }),
  },
};
