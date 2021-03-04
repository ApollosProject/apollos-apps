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

  async acceptFollowRequest({ requestPersonId }) {
    const { Auth, Person } = this.context.dataSources;
    const currentPerson = await Auth.getCurrentPerson();
    const currentPersonId = await Person.resolveId(currentPerson.id);

    const existingRequest = await this.model.findOne({
      where: {
        requestPersonId,
        followedPersonId: currentPersonId,
      },
    });

    if (!existingRequest) {
      throw new Error('No matching request');
    }

    await existingRequest.update({ state: FollowState.ACCEPTED });

    return { followRequestId: existingRequest.id, state: FollowState.ACCEPTED };
  }

  async ignoreFollowRequest({ requestPersonId }) {
    const { Auth, Person } = this.context.dataSources;
    const currentPerson = await Auth.getCurrentPerson();
    const currentPersonId = await Person.resolveId(currentPerson.id);

    const existingRequest = await this.model.findOne({
      where: {
        requestPersonId,
        followedPersonId: currentPersonId,
      },
    });

    if (!existingRequest) {
      throw new Error('No matching request');
    }

    await existingRequest.update({ state: FollowState.DECLINED });

    return { followRequestId: existingRequest.id, state: FollowState.DECLINED };
  }
}

export { FollowRequestDataSource as default };
