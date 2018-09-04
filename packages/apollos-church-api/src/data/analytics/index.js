import { AuthenticationError } from 'apollo-server';
import DataSource from 'apollo-datasource';
import GAInterface from './interfaces/ga';
import SegmentInterface from './interfaces/segment';

const mapArrayToObject = (array) =>
  array.reduce((accum, { field, value }) => {
    // eslint-disable-next-line no-param-reassign
    accum[field] = value;
    return accum;
  }, {});

export const getInterfaces = () => {
  const interfaces = [];
  if (process.env.APOLLOS_SEGMENT_KEY) {
    interfaces.push(new SegmentInterface(process.env.APOLLOS_SEGMENT_KEY));
  }
  if (process.env.APOLLOS_GA_KEY) {
    interfaces.push(new GAInterface(process.env.APOLLOS_SEGMENT_KEY));
  }
  return interfaces;
};

export class Analytics extends DataSource {
  constructor(interfaces = []) {
    super();
    this.interfaces = interfaces || getInterfaces();
  }

  get identifyInterfaces() {
    return this.interfaces.filter((i) => i.shouldIdentify);
  }

  get trackInterfaces() {
    return this.interfaces.filter((i) => i.shouldTrack);
  }

  get Auth() {
    return this.context.dataSources.Auth;
  }

  async getCurrentUser() {
    let user;
    try {
      user = await this.Auth.getCurrentPerson();
    } catch (e) {
      if (!(e instanceof AuthenticationError)) {
        throw e;
      }
    }
    return user;
  }

  async identify({ input: { anonymousId, deviceInfo, traits } }) {
    const currentUser = await this.getCurrentPerson();
    this.identifyInterfaces.forEach(async (iface) => {
      const parsedTraits = mapArrayToObject(traits);
      iface.identify({
        userId: currentUser && currentUser._id,
        anonymousId,
        traits: {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          ...parsedTraits,
        },
        context: deviceInfo,
      });
    });
  }

  async track({ input: { anonymousId, deviceInfo, eventName, properties } }) {
    const currentUser = await this.getCurrentPerson();
    this.trackInterfaces.forEach(async (iface) => {
      const parsedProps = mapArrayToObject(properties);
      iface.track({
        userId: currentUser && currentUser._id,
        anonymousId,
        properties: parsedProps,
        event: eventName,
        context: deviceInfo,
      });
    });
  }
}

export resolver from './resolver';
export schema from './schema';
export { Analytics as dataSource };
