import { get } from 'lodash';
import { parseGlobalId } from '@apollosproject/server-core';
import { PostgresDataSource } from '../postgres';
import { latLonDistance } from '../utils';

export default class Campus extends PostgresDataSource {
  modelName = 'campus';

  ONLINE_CAMPUS_FIELDS = {
    street1: 'No locations near you. ',
    city: "When there's one",
    state: "we'll let you know!",
    postalCode: '',
  };

  getAll() {
    return this.model.findAll();
  }

  async getByLocation({ latitude, longitude } = {}) {
    let campuses = await this.getAll();

    const onlineCampuses = campuses.filter(({ digital }) => digital);
    campuses = campuses.filter(({ digital }) => !digital);

    campuses = campuses.map((campus) => {
      const distanceFromLocation = latLonDistance(
        latitude,
        longitude,
        campus.latitude,
        campus.longitude
      );
      // eslint-disable-next-line no-param-reassign
      campus.distanceFromLocation = distanceFromLocation;
      return campus;
    });

    // Sort campuses from closest to farthest.
    campuses = campuses.sort(
      (a, b) => a.distanceFromLocation - b.distanceFromLocation
    );

    // If every campus is far away, show the online campuses first.
    if (
      campuses.every(({ distanceFromLocation }) => distanceFromLocation > 50)
    ) {
      campuses = [...onlineCampuses, ...campuses];
    } else {
      campuses = [...campuses, ...onlineCampuses];
    }

    return campuses;
  }

  // eslint-disable-next-line class-methods-use-this
  async getForPerson(root) {
    return root.getCampus();
  }

  getAddressField = ({ field, root }) => {
    if (root.digital) {
      return (
        get(this.context.dataSources.Config, `ONLINE_CAMPUS.FIELDS.${field}`) ||
        this.ONLINE_CAMPUS_FIELDS[field]
      );
    }
    return root[field];
  };

  async updateCurrentUserCampus({ campusId }) {
    const { Person } = this.context.dataSources;
    const person = await Person.getCurrentPerson();

    const { id } = parseGlobalId(campusId);
    const campus = await this.getFromId(id);

    await person.setCampus(campus);

    return person;
  }
}
