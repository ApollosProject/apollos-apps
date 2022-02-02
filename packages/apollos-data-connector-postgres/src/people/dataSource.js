import { AuthenticationError, UserInputError } from 'apollo-server';
import { camelCase } from 'lodash';
import Sequelize, { Op } from 'sequelize';
import { parseCursor, createCursor } from '@apollosproject/server-core';

import { PostgresDataSource } from '../postgres';

export const fieldsAsObject = (fields) =>
  fields.reduce(
    (accum, { field, value }) => ({
      ...accum,
      [camelCase(field)]: typeof value === 'string' ? value.trim() : value,
    }),
    {}
  );

export const camelCaseKeys = (obj) =>
  Object.keys(obj).reduce((accum, curr) => {
    // eslint-disable-next-line no-param-reassign
    accum[camelCase(curr)] = obj[curr];
    return accum;
  }, {});

export default class Person extends PostgresDataSource {
  modelName = 'people';

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

    // Don't allow users to update their phone number of email
    delete profileFields.phone;
    delete profileFields.email;

    try {
      await this.model.update(profileFields, { where });
    } catch (e) {
      const errors = { base: e };
      if (
        e.message.includes(
          'duplicate key value violates unique constraint "people_phone_key"'
        )
      ) {
        errors.phone = 'Already in use';
      }
      if (e.message.includes('Phone number invalid')) {
        errors.phone = 'Invalid phone number format. Should be xxx-xxx-xxxx';
      }

      throw new UserInputError('Invalid user input', errors);
    }

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

  async byPaginatedQuery({ name = '', after, first = 20 }) {
    // logged out users can't search. fine by me!
    const currentPersonId = await this.getCurrentPersonId();

    const length = first;
    let offset = 0;
    if (after) {
      const parsed = parseCursor(after);
      if (parsed && Object.hasOwnProperty.call(parsed, 'position')) {
        offset = parsed.position + 1;
      } else {
        throw new Error(`An invalid 'after' cursor was provided: ${after}`);
      }
    }
    const people = await this.model.findAll({
      where: {
        [Op.and]: [
          Sequelize.literal(
            // using op.and here is weird, but there's not another good way to use a literal as a where statement
            `lower("first_name" || ' ' || "last_name") LIKE ${this.sequelize.escape(
              `%${name.toLowerCase().trim()}%`
            )}`
          ),
          { id: { [Op.ne]: currentPersonId }, apollosUser: true },
        ],
      },
      limit: length,
      include: [
        {
          model: this.sequelize.models.follows,
          as: 'followingRequests',
          where: { requestPersonId: currentPersonId },
          required: false,
        },
        {
          model: this.sequelize.models.follows,
          as: 'requestedFollows',
          where: { requestPersonId: currentPersonId },
          required: false,
        },
      ],
      order: [['id', 'desc']], // arbitrary for now
      offset,
    });

    return people.map((node, i) => ({
      node,
      cursor: createCursor({ position: i + offset }),
    }));
  }

  // Returns a where clause that will find the current person
  // Raise an error if the current person doesn't exist
  // Smart enough to work even if the Auth dataSource pulls from a different database than postgres
  whereCurrentPerson = async () => {
    const { Auth } = this.context.dataSources;
    const { personId } = this.context;

    if (personId) {
      // If we have a personId, that means we have a postgres user / postgres login.
      // Let's fasttrack.
      return {
        id: personId,
      };
    }

    const currentPerson = await Auth.getCurrentPerson();

    if (!currentPerson)
      throw new AuthenticationError('No person in current context');

    let where = { id: currentPerson.id };
    if (Auth.ORIGIN_TYPE) {
      where = {
        originId: String(currentPerson.id),
        originType: Auth.ORIGIN_TYPE,
      };
    }

    return where;
  };

  async getCurrentPerson() {
    if (this.context.currentPostgresPerson) {
      return this.context.currentPostgresPerson;
    }

    // The following method is a little complicated since it also handles Rock people / rock logins
    // We can simplify once we remove support for logging in via Rock Cookies.
    const currentPersonWhere = await this.whereCurrentPerson();
    const person = await this.model.findOne({ where: currentPersonWhere });

    if (!person) {
      // We've seen this happen in a few instances related to deduping.
      // Best bet is to log the user out and give them another chance to sign in.
      throw new AuthenticationError('Person not found in the database');
    }
    // cache the current user on the context. avoids oft repeated n+1 queries.
    // this is a huge win, but we need to identify a more elegant way to do this in the future.
    this.context.currentPostgresPerson = person;

    return person;
  }

  async getCurrentPersonId() {
    if (this.context.personId) {
      return this.context.personId;
    }

    // This is the old school (rock) way. We can remove once we ditch rock auth.
    if (this.context.currentPostgresPerson) {
      return this.context.currentPostgresPerson.id;
    }
    const person = await this.getCurrentPerson();
    return person.id;
  }

  async getUsersFollowing() {
    const currentPersonId = await this.getCurrentPersonId();

    return this.model.findAll({
      include: [
        {
          model: this.sequelize.models.follows,
          as: 'followingRequests',
          where: { requestPersonId: currentPersonId },
        },
      ],
    });
  }
}
