import Crypto from 'crypto';
import { get } from 'lodash';

const secret = process.env.SECRET || 'LZEVhlgzFZKClu1r';

export function createGlobalId(id, type) {
  const cipher = Crypto.createCipher('aes192', secret);

  let encrypted = cipher.update(`${id}`, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${type}:${encrypted}`;
}

export function parseGlobalId(encodedId) {
  try {
    const decipher = Crypto.createDecipher('aes192', secret);

    const [__type, encryptedId] = encodedId.split(':');
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

const getPossibleDataModels = ({ schema, __type }) => {
  const possibleType = schema.getTypeMap()[__type];
  if (!possibleType || !possibleType.astNode.interfaces) {
    return [__type];
  }
  const possibleInterfaces = possibleType.astNode.interfaces
    .map(({ name: { value } }) => value)
    .filter((value) => value !== 'Node');

  return [__type, ...possibleInterfaces];
};

export default class Node {
  // eslint-disable-next-line class-methods-use-this
  async get(encodedId, dataSources, schema) {
    const { __type, id } = parseGlobalId(encodedId);
    const possibleModels = getPossibleDataModels({ __type, schema });
    const modelType = possibleModels.find((type) =>
      get(dataSources, `${type}.getFromId`, false)
    );

    if (!modelType && dataSources[__type] != null) {
      throw new Error(
        `You have a dataSource for ${__type} but it does not implement  \`getFromId\``
      );
    } else if (!modelType) {
      throw new Error(`No dataSource found using ${__type}`);
    }

    const data = await dataSources[modelType].getFromId(id, encodedId);
    if (data) data.__type = __type;
    return data;
  }
}
