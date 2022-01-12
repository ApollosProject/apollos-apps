import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';

export default class Group extends RockApolloDataSource {
  resource = 'Groups';

  expanded = true;

  // these are standard across rock
  get groupTypeMap() {
    return {
      Serving: this.Config.ROCK_MAPPINGS.SERVING_GROUP_TYPE_ID || 23,
      Community: this.Config.ROCK_MAPPINGS.COMMUNITY_GROUP_TYPE_ID || 25,
      Family: this.Config.ROCK_MAPPINGS.FAMILY_GROUP_TYPE_ID || 10,
    };
  }

  getFromId = ({ id }) => this.request().find(id).expand('Members').get();

  getMembers = async (groupId) => {
    const { Person } = this.context.dataSources;
    const members = await this.request('GroupMembers')
      .andFilter(`GroupId eq ${groupId}`)
      .get();
    return Promise.all(
      members.map(({ personId }) =>
        Person.getFromId(personId, null, { originType: 'rock' })
      )
    );
  };

  getLeaders = async (groupId) => {
    const { Person } = this.context.dataSources;
    const members = await this.request('GroupMembers')
      .filter(`GroupId eq ${groupId}`)
      .andFilter('GroupRole/IsLeader eq true')
      .expand('GroupRole')
      .get();
    const leaders = await Promise.all(
      members.map(({ personId }) =>
        Person.getFromId(personId, null, { originType: 'rock' })
      )
    );
    return leaders.length ? leaders : null;
  };

  getByPerson = async ({ personId, type = null, asLeader = false }) => {
    // Get the active groups that the person is a member of.
    // Conditionally filter that list of groups on whether or not your
    // role in that group is that of "Leader".
    const groupAssociations = await this.request('GroupMembers')
      .expand('GroupRole')
      .filter(
        `PersonId eq ${personId} ${
          asLeader ? ' and GroupRole/IsLeader eq true' : ''
        }`
      )
      .andFilter(`GroupMemberStatus ne 'Inactive'`)
      .get();

    // Get the actual group data for the groups above.
    const groups = await Promise.all(
      groupAssociations.map(({ groupId }) => this.getFromId({ id: groupId }))
    );

    // Filter the groups to make sure we only pull those that are
    // active and NOT archived
    const filteredGroups = await Promise.all(
      groups.filter(
        (group) => group.isActive === true && group.isArchived === false
      )
    );

    // Remove the groups that aren't of the types we want and return.
    return filteredGroups.filter(({ groupTypeId }) =>
      type
        ? groupTypeId === this.groupTypeMap[type]
        : Object.values(this.groupTypeMap).includes(groupTypeId)
    );
  };
}
