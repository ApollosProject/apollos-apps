import { get } from 'lodash';

import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

class Persona extends RockApolloDataSource {
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
}

export { Persona as dataSource };
