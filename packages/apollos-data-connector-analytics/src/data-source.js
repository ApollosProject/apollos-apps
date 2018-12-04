import { AuthenticationError } from 'apollo-server';
import { DataSource } from 'apollo-datasource';
import ApollosConfig from '@apollosproject/config';
import GAInterface from './interfaces/ga';
import SegmentInterface from './interfaces/segment';
import RockInteractions from './interfaces/rock_interactions';

const { ANALYTICS } = ApollosConfig;
// Utility function to convert GQL array of key/values to Object.
const mapArrayToObject = (array = []) =>
  array.reduce((accum, { field, value }) => {
    // eslint-disable-next-line no-param-reassign
    accum[field] = value;
    return accum;
  }, {});

// Add interfaces to this function to get picked up automatically.
export const getInterfaces = () => {
  const interfaces = [new RockInteractions()];
  if (ANALYTICS.SEGMENT_KEY) {
    interfaces.push(new SegmentInterface(ANALYTICS.SEGMENT_KEY));
  }
  if (ANALYTICS.GA_ID) {
    interfaces.push(new GAInterface(ANALYTICS.GA_ID));
  }
  return interfaces;
};

export default class Analytics extends DataSource {
  // Interfaces should extend BaseInterface in the interfaces folder.
  // They should extend BaseAnalytics and implement
  // track({ event: String, anonymousId: String, userId: String, properties: Obj, context: Obj })
  // and
  // track({ event: String, anonymousId: String, userId: String, traits: Obj, context: Obj })
  constructor(interfaces = []) {
    super();
    this.interfaces = interfaces.length ? interfaces : getInterfaces();
  }

  // Called automatically b/c extends DataSource.
  initialize({ context }) {
    this.context = context;
    this.interfaces.forEach((iface) => {
      iface.initialize({ context });
    });
  }

  get identifyInterfaces() {
    return this.interfaces.filter((i) => i.shouldIdentify);
  }

  get trackInterfaces() {
    return this.interfaces.filter((i) => i.shouldTrack);
  }

  // Shorthand to get Auth module.
  get Auth() {
    return this.context.dataSources.Auth;
  }

  async getCurrentPerson() {
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

  // Called via the `identify` mutation.
  // traits is an array of objects matching the pattern [{ field: String, value: String}]
  async identify({ anonymousId, deviceInfo, traits }) {
    const currentUser = await this.getCurrentPerson();
    this.identifyInterfaces.forEach(async (iface) => {
      const parsedTraits = mapArrayToObject(traits);
      iface.identify({
        userId: currentUser && currentUser.id,
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
    return { success: true };
  }

  // Called via the `track` mutation.
  // properties is an array of objects matching the pattern [{ field: String, value: String}]
  async track({ anonymousId, deviceInfo, eventName, properties }) {
    const currentUser = await this.getCurrentPerson();
    const parsedProps = mapArrayToObject(properties);
    this.trackInterfaces.forEach(async (iface) => {
      if (
        iface.eventWhitelist === null ||
        iface.eventWhitelist.includes(eventName)
      ) {
        iface.track({
          userId: currentUser && currentUser.id,
          anonymousId,
          properties: parsedProps,
          event: eventName,
          context: deviceInfo,
          sessionId: this.context.sessionId, // used for the rock interface
        });
      }
    });
    return { success: true };
  }
}
