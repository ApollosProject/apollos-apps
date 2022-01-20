import { AuthenticationError } from 'apollo-server';

export const enforceProtocol = (uri) =>
  uri.startsWith('//') ? `https:${uri}` : uri;

export const createImageUrlFromGuid = (uri, Config) =>
  uri.split('-').length === 5
    ? `${
        Config.ROCK.IMAGE_URL || `${Config.ROCK.URL}/GetImage.ashx`
      }?guid=${uri}`
    : enforceProtocol(uri);

export const fieldsAsObject = (fields) =>
  fields.reduce(
    (accum, { field, value }) => ({
      ...accum,
      [field]: typeof value === 'string' ? value.trim() : value,
    }),
    {}
  );

export const enforceCurrentUser = (func) => async (
  root,
  args,
  context,
  info
) => {
  try {
    const currentPerson = await context.dataSources.Person.getCurrentPerson();
    if (root.id !== currentPerson.originId) {
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
