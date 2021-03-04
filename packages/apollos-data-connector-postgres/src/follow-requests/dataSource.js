import { AuthenticationError } from 'apollo-server';
import { PostgresDataSource } from '../postgres';
import { FollowState } from './model';

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

      if (dataValues.state === FollowState.ACCEPTED) {
        // The request was already accepted.
        return { followRequestId, state: dataValues.state };
      }

      // If a request already exists that was denied, update it as a new request.
      await existingRequest.update({ state: FollowState.REQUESTED });
    } else {
      // There was no existing request, so lets make one.
      const newRequest = await this.model.create({
        requestPersonId,
        followedPersonId,
        state: FollowState.REQUESTED,
      });

      followRequestId = newRequest.id;
    }

    return { followRequestId, state: FollowState.REQUESTED };
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

    if (existingRequest.dataValues.followedPersonId !== requestPersonId) {
      throw new Error('You are not authorized to do that');
    }

    await existingRequest.update({ state: FollowState.ACCEPTED });

    return { followRequestId, state: FollowState.ACCEPTED };
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

    if (existingRequest.dataValues.followedPersonId !== requestPersonId) {
      throw new Error('You are not authorized to do that');
    }

    await existingRequest.update({ state: FollowState.DECLINED });

    return { followRequestId, state: FollowState.DECLINED };
  }
}

export { FollowRequestDataSource as default };
