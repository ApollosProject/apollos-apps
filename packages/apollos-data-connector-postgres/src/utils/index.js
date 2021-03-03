import { AuthenticationError } from 'apollo-server';

export const enforceCurrentUser = (func) => async (
  root,
  args,
  context,
  info
) => {
  try {
    const currentPerson = await context.dataSources.Auth.getCurrentPerson();
    // If the root is a postgres person
    // And the auth datasource is not
    if (root.originType && !currentPerson.originType) {
      // Check the originId against the postgres id
      if (String(root.originId) !== String(currentPerson.id)) {
        return null;
      }
      // otherwise check id against id
    } else if (root.id !== currentPerson.id) {
      return null;
    }
  } catch (e) {
    if (!(e instanceof AuthenticationError)) {
      throw e;
    }
    return null;
  }
  return func(root, args, context, info);
};
