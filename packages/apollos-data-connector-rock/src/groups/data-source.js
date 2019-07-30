import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { parseGlobalId } from '@apollosproject/server-core';

export default class Group extends RockApolloDataSource {
  resource = 'Groups';

  expanded = true;

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();

  getAll = () =>
    this.request()
      .filter('IsActive eq true')
      .get();

  getFamilies = (personId) =>
    this.request(`/Groups/GetFamilies/${parseGlobalId(personId)}`);

  getHomeGroups = () => null;

  getServingGroups = () => null;

  getForPerson = (personId) => null;
}
