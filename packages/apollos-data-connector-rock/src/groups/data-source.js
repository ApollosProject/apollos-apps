import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { parseGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS } = ApollosConfig;
export default class Group extends RockApolloDataSource {
  resource = 'Groups';

  expanded = true;

  getFromId = (id) =>
    this.request()
      .filter(`Id eq ${id}`)
      .expand('Members')
      .first();

  getMembers = async (groupId) => {
    const { Person } = this.context.dataSources;
    const members = await this.request('/GroupMembers/')
      .filter(`GroupId eq ${groupId}`)
      .get();
    return members.map(({ personId }) => Person.getFromId(personId));
  };

  getLeader = async (groupId) => {
    const { Person } = this.context.dataSources;
    const leader = await this.request('/GroupMembers/')
      .filter(`GroupId eq ${groupId}`)
      .andFilter('GroupRole/IsLeader eq true')
      .expand('GroupRole')
      .first(); // should only be one leader
    return leader ? Person.getFromId(leader.personId) : null;
  };

  getAll = () =>
    this.request()
      .filter('IsActive eq true')
      .get();

  getByPerson = async (personId) => {
    const myGroupAssociations = await this.request('/GroupMembers/')
      .filter(`PersonId eq ${personId}`)
      .get();
    return Promise.all(
      myGroupAssociations.map(({ groupId }) => this.getFromId(groupId))
    );
  };

  getLeadByPerson = async (personId) => {
    const allGroups = await this.getByPerson(personId);
    const leaders = await Promise.all(
      allGroups.map(({ id }) => this.getLeader(id))
    );
    return allGroups.filter((group, index) =>
      leaders[index] ? leaders[index].id === personId : false
    );
  };

  getFamilies = (personId) => {
    const { id } = parseGlobalId(personId);
    return this.request(`/Groups/GetFamilies/${id}`).get();
  };

  getHomeGroups = async (personId) => {
    const { id } = parseGlobalId(personId);
    const allGroups = await this.getByPerson(id);
    return allGroups.filter(
      ({ groupTypeId }) => groupTypeId === ROCK_MAPPINGS.HOME_GROUP_TYPE_ID
    );
  };

  getServingGroups = async (personId) => {
    const { id } = parseGlobalId(personId);
    const allGroups = await this.getByPerson(id);
    return allGroups.filter(
      ({ groupTypeId }) => groupTypeId === ROCK_MAPPINGS.SERVING_GROUP_TYPE_ID
    );
  };
}
