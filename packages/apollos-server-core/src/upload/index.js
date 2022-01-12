import { uploadSchema } from '@apollosproject/data-schema';
import { GraphQLUpload, graphqlUploadExpress } from 'graphql-upload';

export { uploadSchema as schema };

export const resolver = {
  Upload: GraphQLUpload,
};

export const serverMiddleware = ({ app }) => {
  app.use(graphqlUploadExpress());
};
