import Crypto from 'crypto';

export const withEdgePagination = async ({ edges }) => {
  const result = await edges;
  const startCursor = result.length ? result[0].cursor : null;
  const endCursor = result.length ? result[result.length - 1].cursor : null;
  return { startCursor, endCursor };
};

const secret = process.env.SECRET || 'SEfjsvoSDFnvblaE';

export function createCursor(obj) {
  const str = JSON.stringify(obj);
  const cipher = Crypto.createCipher('aes192', secret);
  let encrypted = cipher.update(str, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encodeURI(encrypted);
}

export function parseCursor(str) {
  try {
    const decipher = Crypto.createDecipher('aes192', secret);

    let decrypted = decipher.update(decodeURI(str), 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (e) {
    throw new Error('Error parsing cursor');
  }
}
