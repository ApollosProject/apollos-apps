import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { parseGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS } = ApollosConfig;
export default class Group extends RockApolloDataSource {
  resource = 'Groups';

  expanded = true;

  activeFilter = 'IsActive eq true and IsArchived eq false';

  getAll = () =>
    this.request()
      .filter(this.activeFilter)
      .expand('Members')
      .get();

  getFromId = (id) =>
    this.request()
      .filter(`Id eq ${id}`)
      .expand('Members')
      .first();

  getMembers = async (groupId) => {
    const { Person } = this.context.dataSources;
    const members = await this.request('/GroupMembers/')
      .andFilter(`GroupId eq ${groupId}`)
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

  getByPerson = async (personId) => {
    const myGroupAssociations = await this.request('/GroupMembers/')
      .filter(`PersonId eq ${personId}`)
      .get();
    const allGroups = await Promise.all(
      myGroupAssociations.map(({ groupId }) => this.getFromId(groupId))
    );
    // only return active and not archived groups
    return allGroups.filter(
      ({ isActive, isArchived }) => isActive && !isArchived
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
    return this.request(`/Groups/GetFamilies/${id}`)
      .filter(this.activeFilter)
      .get();
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
