import { isUuid } from '@apollosproject/server-core';
import { AuthenticationError } from 'apollo-server';
import { camelCase } from 'lodash';

import { PostgresDataSource } from '../postgres';

export const fieldsAsObject = (fields) =>
  fields.reduce(
    (accum, { field, value }) => ({
      ...accum,
      [camelCase(field)]: typeof value === 'string' ? value.trim() : value,
    }),
    {}
  );

export const camelCaseKeys = (obj) => {
  return Object.keys(obj).reduce((accum, curr) => {
    // eslint-disable-next-line no-param-reassign
    accum[camelCase(curr)] = obj[curr];
    return accum;
  }, {});
};

export default class Person extends PostgresDataSource {
  modelName = 'people';

  /**
   * If the provided id is a Rock id, find and return the postgres id
   */
  async resolveId(id) {
    const { Auth } = this.context.dataSources;

    if (!isUuid(id) && Auth.ORIGIN_TYPE) {
      const person = await this.model.findOne({
        where: {
          originId: id.toString(),
          originType: Auth.ORIGIN_TYPE,
        },
      });

      if (!person) throw new Error(`Invalid user Id ${id}`);

      return person.id;
    }

    return id;
  }

  async create(attributes) {
    const cleanedAttributes = camelCaseKeys(attributes);
    const person = await this.model.create({
      apollosUser: true,
      ...cleanedAttributes,
      ...(cleanedAttributes.gender
        ? { gender: cleanedAttributes.gender.toUpperCase() }
        : {}),
    });
    return person.id;
  }

  // fields is an array of objects matching the pattern
  // [{ field: String, value: String }]
  updateProfile = async (fields) => {
    const where = await this.whereCurrentPerson();

    const profileFields = fieldsAsObject(fields);

    await this.model.update(profileFields, { where });

    return this.model.findOne({ where });
  };

  uploadProfileImage = async (file, length) => {
    const {
      dataSources: { BinaryFiles },
    } = this.context;

    const { createReadStream, filename } = await file;

    const stream = createReadStream();

    const photoId = await BinaryFiles.uploadFile({ filename, stream, length });
    const url = await BinaryFiles.findOrReturnImageUrl({ id: photoId });

    const where = await this.whereCurrentPerson();

    await this.model.update({ profileImageUrl: url }, { where });

    return this.model.findOne({ where });
  };

  // Returns a where clause that will find the current person
  // Raise an error if the current person doesn't exist
  // Smart enough to work even if the Auth dataSource pulls from a different database than postgres
  whereCurrentPerson = async () => {
    const { Auth } = this.context.dataSources;

    const currentPerson = await Auth.getCurrentPerson();

    if (!currentPerson) throw new AuthenticationError('Invalid Credentials');

    let where = { id: currentPerson.id };
    if (Auth.ORIGIN_TYPE) {
      where = {
        originId: String(currentPerson.id),
        originType: Auth.ORIGIN_TYPE,
      };
    }

    return where;
  };
}
