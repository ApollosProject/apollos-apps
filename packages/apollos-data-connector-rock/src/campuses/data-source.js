import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { parseGlobalId } from '@apollosproject/server-core';

export default class Campus extends RockApolloDataSource {
  resource = 'Campuses';

  expanded = true;

  updateCurrentUserCampus = async ({ rockId, campusId }) => {
    if (!rockId && !campusId) return null;
    const { Auth } = this.context.dataSources;

    const currentUser = await Auth.getCurrentPerson();
    const personGroup = await this.request(
      `/Groups/GetFamilies/${currentUser.id}`
    ).first();

    if (!personGroup) return null;
    await this.patch(`/Groups/${personGroup.id}`, {
      CampusId: campusId ? parseGlobalId(campusId).id : rockId,
    });

    return currentUser;
  };
}
