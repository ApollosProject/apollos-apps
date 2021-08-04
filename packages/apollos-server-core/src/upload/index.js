import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';

export const schema = `
  scalar Upload
`;

export const resolver = {
  Upload: GraphQLUpload,
};

export const serverMiddleware = ({ app }) => {
  app.use(graphqlUploadExpress());
};
