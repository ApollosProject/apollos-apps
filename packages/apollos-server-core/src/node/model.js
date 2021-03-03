import Crypto from 'crypto';
import { get, uniq, flatMap } from 'lodash';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

const secret = process.env.SECRET || 'LZEVhlgzFZKClu1r';

export function createGlobalId(id, type) {
  const cipher = Crypto.createCipher('aes192', secret);

  let encrypted = cipher.update(`${id}`, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${type}:${encrypted}`;
}

export const isUuid = (id) =>
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    `${id}`
  );

export function parseGlobalId(encodedId) {
  try {
    const decipher = Crypto.createDecipher('aes192', secret);

    const [__type, encryptedId] = encodedId.split(':');

    // That means it's a postgres ID belonging it's an apollos database
    if (isUuid(encryptedId)) {
      return {
        __type,
        id: encryptedId,
      };
    }

    let decrypted = decipher.update(encryptedId, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const id = decrypted.toString();
    return {
      __type,
      id,
    };
  } catch (e) {
    throw new Error('Error parsing ID');
  }
}

export default class Node {
  // eslint-disable-next-line class-methods-use-this
  async get(encodedId, dataSources, resolveInfo) {
    const { __type, id } = parseGlobalId(encodedId);
    // returns a list of types that could possibly be dataModels

    // Get fields nested under `node`
    const siblingFields = flatMap(
      Object.values(parseResolveInfo(resolveInfo).fieldsByTypeName),
      (typeInfo) => Object.values(typeInfo).map(({ name }) => name)
    );

    // If we only have __typename or/and 'id' in the request
    // Then we can shortcut the need to fetch the entire document.
    // This helps us keep a clean schema but also minimize uneeded requests.
    if (uniq([...siblingFields, '__typename', 'id']).length === 2) {
      return { id, __typename: __type, __type };
    }

    const possibleModels = this.getPossibleDataModels({
      __type,
      schema: resolveInfo.schema,
    });
    // check to see if any of those models have a dataSource wtih a getFromId method and return's it's name
    // (if it exists)
    const modelName = possibleModels.find((type) =>
      get(dataSources, `${type}.getFromId`, false)
    );

    if (!modelName && dataSources[__type] != null) {
      throw new Error(
        `You have a dataSource for ${__type} but it does not implement  \`getFromId\``
      );
    } else if (!modelName) {
      throw new Error(`No dataSource found using ${__type}`);
    }

    const data = await dataSources[modelName].getFromId(id, encodedId, {
      info: resolveInfo,
    });
    if (data) data.__type = __type;
    return data;
  }

  getPossibleDataModels = ({ schema, __type }) => {
    // The ast representation of the that we're resolving `__type`
    const originalType = schema.getTypeMap()[__type];
    if (!originalType || !originalType.astNode.interfaces) {
      // if the type doesn't exist, or doesn't have any interfaces, exit early
      return [__type];
    }
    // Grab the names of all interfaces for that type
    const possibleInterfaces = originalType.astNode.interfaces
      .map(({ name: { value } }) => value)
      .filter((value) => value !== 'Node');

    // Return a list of the type itself, followed by all interfaces of that type
    return [__type, ...possibleInterfaces];
  };
}
