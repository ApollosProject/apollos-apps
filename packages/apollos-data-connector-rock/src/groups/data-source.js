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

  getFamilies = (personId) => {
    const { id } = parseGlobalId(personId);
    return this.request(`/Groups/GetFamilies/${id}`).get();
  };

  // TODO
  getHomeGroups = () => null;

  getServingGroups = async (personId) => {
    const allGroups = await this.getForPerson(personId);
    console.log(allGroups);
    return allGroups;
  };

  getForPerson = async (personId) => {
    const myGroupAssociations = await this.request('/GroupMembers/')
      .filter(`PersonId eq ${personId}`)
      .get();
    return myGroupAssociations.map(({ groupId }) => this.getFromId(groupId));
  };
}
