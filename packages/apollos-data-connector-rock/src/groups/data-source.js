import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';

const { ROCK_MAPPINGS } = ApollosConfig;
export default class Group extends RockApolloDataSource {
  resource = 'Groups';

  expanded = true;

  groupTypeMap = {
    Serving: ROCK_MAPPINGS.SERVING_GROUP_TYPE_ID,
    Community: ROCK_MAPPINGS.COMMUNITY_GROUP_TYPE_ID,
    Family: ROCK_MAPPINGS.FAMILY_GROUP_TYPE_ID,
  };

  getFromId = ({ id, activeOnly = false }) =>
    this.request()
      .find(id)
      .expand('Members')
      .filter(`${activeOnly ? 'IsActive eq true and IsArchived eq false' : ''}`)
      .get();

  getMembers = async (groupId) => {
    const { Person } = this.context.dataSources;
    const members = await this.request('GroupMembers')
      .andFilter(`GroupId eq ${groupId}`)
      .get();
    return members.map(({ personId }) => Person.getFromId(personId));
  };

  getLeaders = async (groupId) => {
    const { Person } = this.context.dataSources;
    const members = await this.request('GroupMembers')
      .filter(`GroupId eq ${groupId}`)
      .andFilter('GroupRole/IsLeader eq true')
      .expand('GroupRole')
      .get();
    const leaders = await Promise.all(
      members.map(({ personId }) => Person.getFromId(personId))
    );
    return leaders.length ? leaders : null;
  };

  getByPerson = async ({ personId, type = null, asLeader = false }) => {
    const groupAssociations = await this.request('GroupMembers')
      .expand('GroupRole')
      .filter(
        `PersonId eq ${personId} ${
          asLeader ? ' and GroupRole/IsLeader eq true' : ''
        }`
      )
      .get();
    const groups = await Promise.all(
      groupAssociations.map(({ groupId }) =>
        this.getFromId({ id: groupId, activeOnly: true })
      )
    );
    return groups.filter(({ groupTypeId }) =>
      type
        ? groupTypeId === this.groupTypeMap[type]
        : Object.values(this.groupTypeMap).includes(groupTypeId)
    );
  };
}
