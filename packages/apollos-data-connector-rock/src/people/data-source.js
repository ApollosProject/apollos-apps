import { AuthenticationError, UserInputError } from 'apollo-server';
import { camelCase, mapKeys, get } from 'lodash';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import moment from 'moment';
import ApollosConfig from '@apollosproject/config';

const RockGenderMap = {
  Unknown: 0,
  Male: 1,
  Female: 2,
};

export default class Person extends RockApolloDataSource {
  resource = 'People';

  getFromId = (id) =>
    this.request()
      .filter(`Id eq ${id}`)
      .expand('Photo')
      .first();

  getFromAliasId = async (id) => {
    // Fetch the PersonAlias, selecting only the PersonId.
    const personAlias = await this.request('/PersonAlias')
      .filter(`Id eq ${id}`)
      .select('PersonId')
      .first();

    // If we have a personAlias, return him.
    if (personAlias) {
      return this.getFromId(personAlias.personId);
    }
    // Otherwise, return null.
    return null;
  };

  // Gets a collection of all dataviews a user is in
  // Returns an array of dataview guids
  getPersonas = async ({ categoryId }) => {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;

    // Get current user
    const { id } = await Auth.getCurrentPerson();

    // Get the entity type ID of the Person model
    const personEntityTypeId = await RockConstants.modelType('Person');

    // Rely on custom code without the plugin.
    // Use plugin, if the user has set USE_PLUGIN to true.
    // In general, you should ALWAYS use the plugin if possible.
    const endpoint = get(ApollosConfig, 'ROCK.USE_PLUGIN', false)
      ? 'Apollos/GetPersistedDataViewsForEntity'
      : 'DataViews/GetPersistedDataViewsForEntity';

    // Return a list of all dataviews by GUID a user is a memeber
    return this.request(endpoint)
      .find(`${personEntityTypeId.id}/${id}?categoryId=${categoryId}`)
      .select('Guid')
      .get();
  };

  // fields is an array of objects matching the pattern
  // [{ field: String, value: String }]
  updateProfile = async (fields) => {
    const currentPerson = await this.context.dataSources.Auth.getCurrentPerson();

    if (!currentPerson) throw new AuthenticationError('Invalid Credentials');

    const fieldsAsObject = fields.reduce(
      (accum, { field, value }) => ({
        ...accum,
        [field]: typeof value === 'string' ? value.trim() : value,
      }),
      {}
    );

    // Because we have a custom enum for Gender, we do this transform prior to creating our "update object"
    // i.e. our schema will send Gender: 1 as Gender: Male
    if (fieldsAsObject.Gender) {
      if (!['Unknown', 'Male', 'Female'].includes(fieldsAsObject.Gender)) {
        throw new UserInputError(
          'Rock gender must be either Unknown, Male, or Female'
        );
      }
      fieldsAsObject.Gender = RockGenderMap[fieldsAsObject.Gender];
    }

    let rockUpdateFields = { ...fieldsAsObject };

    if (fieldsAsObject.BirthDate) {
      delete rockUpdateFields.BirthDate;
      const birthDate = moment(fieldsAsObject.BirthDate);

      if (!birthDate.isValid()) {
        throw new UserInputError('BirthDate must be a valid date');
      }

      rockUpdateFields = {
        ...rockUpdateFields,
        // months in moment are 0 indexed
        BirthMonth: birthDate.month() + 1,
        BirthDay: birthDate.date(),
        BirthYear: birthDate.year(),
      };
    }

    await this.patch(`/People/${currentPerson.id}`, rockUpdateFields);

    return {
      ...currentPerson,
      ...mapKeys(fieldsAsObject, (_, key) => camelCase(key)),
    };
  };

  uploadProfileImage = async (file, length) => {
    const {
      dataSources: { Auth, BinaryFiles },
    } = this.context;

    const currentPerson = await Auth.getCurrentPerson();

    if (!currentPerson) throw new AuthenticationError('Invalid Credentials');

    const { createReadStream, filename } = await file;

    const stream = createReadStream();

    const photoId = await BinaryFiles.uploadFile({ filename, stream, length });

    const person = await this.updateProfile([
      { field: 'PhotoId', value: photoId },
    ]);

    const photo = await BinaryFiles.getFromId(photoId);
    return { ...person, photo };
  };
}
