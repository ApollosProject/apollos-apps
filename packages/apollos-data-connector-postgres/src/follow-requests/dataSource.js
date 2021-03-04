import { AuthenticationError } from 'apollo-server';
import { PostgresDataSource } from '../postgres';

class FollowRequestDataSource extends PostgresDataSource {
  modelName = 'follow_requests';

  async requestFollow({ followedPersonId }) {
    const { Auth, Person } = this.context.dataSources;
    const currentPerson = await Auth.getCurrentPerson();

    if (!currentPerson) throw new AuthenticationError('Invalid Credentials');

    const requestPersonId = await Person.resolveId(currentPerson.id);

    const existingRequest = await this.model.findOne({
      where: {
        requestPersonId,
        followedPersonId,
      },
    });

    let followRequestId;

    if (existingRequest) {
      const { dataValues } = existingRequest;
      followRequestId = existingRequest.id;

      if (dataValues.accepted) {
        // The request was already accepted.
        return { followRequestId, following: true };
      }

      // If a request already exists that was denied, update it as a new request.
      await existingRequest.update({ accepted: null });
    } else {
      // There was no existing request, so lets make one.
      const newRequest = await this.model.create({
        requestPersonId,
        followedPersonId,
      });

      followRequestId = newRequest.id;
    }

    return { followRequestId, following: false };
  }

  async acceptFollowRequest({ followRequestId }) {
    const { Auth, Person } = this.context.dataSources;
    const currentPerson = await Auth.getCurrentPerson();
    const requestPersonId = await Person.resolveId(currentPerson.id);

    const existingRequest = await this.model.findOne({
      where: {
        id: followRequestId,
      },
    });

    if (!existingRequest) {
      throw new Error('Invalid request id');
    }

    if (existingRequest.followedPersonId !== requestPersonId) {
      throw new Error('You are not authorized to do that');
    }

    await existingRequest.update({ accepted: true });

    return { followRequestId, following: true };
  }

  async ignoreFollowRequest({ followRequestId }) {
    const { Auth, Person } = this.context.dataSources;
    const currentPerson = await Auth.getCurrentPerson();
    const requestPersonId = await Person.resolveId(currentPerson.id);

    const existingRequest = await this.model.findOne({
      where: {
        id: followRequestId,
      },
    });

    if (!existingRequest) {
      throw new Error('Invalid request id');
    }

    if (existingRequest.followedPersonId !== requestPersonId) {
      throw new Error('You are not authorized to do that');
    }

    await existingRequest.update({ accepted: false });

    return { followRequestId, following: false };
  }
}

export { FollowRequestDataSource as default };
