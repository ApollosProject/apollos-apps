import { get } from 'lodash';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { parseGlobalId } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import { latLonDistance } from '../utils';

export default class Campus extends RockApolloDataSource {
  resource = 'Campuses';

  expanded = true;

  getFromId = (id) =>
    this.request()
      .filter(`Id eq ${id}`)
      .expand('Location')
      .expand('Location/Image')
      .expand('CampusTypeValue')
      .first();

  getAll = () =>
    this.request()
      .filter('IsActive eq true')
      .expand('Location')
      .expand('Location/Image')
      .expand('CampusTypeValue')
      .cache({ ttl: 600 }) // ten minutes
      .get();

  getByLocation = async ({ latitude, longitude } = {}) => {
    let campuses = await this.getAll();

    const onlineCampuses = campuses.filter(
      ({ campusTypeValue }) => campusTypeValue?.value === 'Online'
    );
    campuses = campuses.filter(
      ({ campusTypeValue }) => campusTypeValue?.value !== 'Online'
    );

    campuses = campuses.map((campus) => ({
      ...campus,
      distanceFromLocation: latLonDistance(
        latitude,
        longitude,
        campus.location.latitude,
        campus.location.longitude
      ),
    }));

    campuses = campuses.sort(
      (a, b) => a.distanceFromLocation - b.distanceFromLocation
    );

    if (
      campuses.every(({ distanceFromLocation }) => distanceFromLocation > 50)
    ) {
      campuses = [...onlineCampuses, ...campuses];
    } else {
      campuses = [...campuses, ...onlineCampuses];
    }

    return campuses;
  };

  getForPerson = async ({ id, originId, originType }) => {
    let personId = id;

    if (originType && originType === 'rock') {
      personId = originId;
    }

    const family = await this.request(`/Groups/GetFamilies/${personId}`)
      .expand('Campus')
      .expand('Campus/Location')
      .expand('Campus/CampusTypeValue')
      .expand('Campus/Location/Image')
      .first();

    /* Ensure we have a valid campus instead of returning an empty object
     * if `family.campus` is empty Rock sends:
     *   `{ campus: { location: {} } }`
     */

    if (family && family.campus && family.campus.location) {
      return family.campus;
    }
    return null;
  };

  ONLINE_CAMPUS_FIELDS = {
    street1: 'No locations near you. ',
    city: "When there's one",
    state: "we'll let you know!",
    postalCode: '',
  };

  getAddressField = ({ field, root }) => {
    if (root.campusTypeValue?.value === 'Online') {
      return (
        get(ApollosConfig, `ONLINE_CAMPUS.FIELDS.${field}`) ||
        // TODO: deprecated, use ONLINE_CAMPUS_FIELDS and swap in config yaml
        get(ApollosConfig, `REMOTE_CAMPUS.FIELDS.${field}`) ||
        this.ONLINE_CAMPUS_FIELDS[field]
      );
    }
    return root.location[field];
  };

  updateCurrentUserCampus = async ({ campusId }) => {
    const { Auth } = this.context.dataSources;

    const currentUser = await Auth.getCurrentPerson();
    const personGroup = await this.request(
      `/Groups/GetFamilies/${currentUser.id}`
    ).first();

    if (!personGroup) return null;
    const { id: rockCampusId } = parseGlobalId(campusId);

    await this.patch(`/Groups/${personGroup.id}`, { CampusId: rockCampusId });

    return currentUser;
  };
}
