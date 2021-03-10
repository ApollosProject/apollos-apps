import { parseGlobalId } from '@apollosproject/server-core/lib/node';
import { AuthenticationError } from 'apollo-server';
import { Op } from 'sequelize';
import { PostgresDataSource } from '../postgres';
import { FollowState } from './model';

class Follow extends PostgresDataSource {
  modelName = 'follows';

  async requestFollow({ followedPersonId }) {
    const requestPersonId = await this.getCurrentPersonId();

    const { id } = parseGlobalId(followedPersonId);

    const existingFollow = await this.model.findOne({
      where: {
        requestPersonId,
        followedPersonId: id,
      },
    });

    let followId;

    if (existingFollow) {
      const { dataValues } = existingFollow;
      followId = existingFollow.id;

      if (dataValues.state === FollowState.ACCEPTED) {
        // The request was already accepted.
        return { followId, state: dataValues.state };
      }

      // If a request already exists that was denied, update it as a new request.
      await existingFollow.update({ state: FollowState.REQUESTED });
    } else {
      // There was no existing request, so lets make one.
      const newRequest = await this.model.create({
        requestPersonId,
        followedPersonId: id,
        state: FollowState.REQUESTED,
      });

      followId = newRequest.id;
    }

    return { followId, state: FollowState.REQUESTED };
  }

  async acceptFollowRequest({ requestPersonId }) {
    const currentPersonId = await this.getCurrentPersonId();

    const { id } = parseGlobalId(requestPersonId);

    const existingFollow = await this.model.findOne({
      where: {
        requestPersonId: id,
        followedPersonId: currentPersonId,
      },
    });

    if (!existingFollow) {
      throw new Error('No matching request');
    }

    await existingFollow.update({ state: FollowState.ACCEPTED });

    return { followId: existingFollow.id, state: FollowState.ACCEPTED };
  }

  async ignoreFollowRequest({ requestPersonId }) {
    const currentPersonId = await this.getCurrentPersonId();

    const { id } = parseGlobalId(requestPersonId);

    const existingFollow = await this.model.findOne({
      where: {
        requestPersonId: id,
        followedPersonId: currentPersonId,
      },
    });

    if (!existingFollow) {
      throw new Error('No matching request');
    }

    await existingFollow.update({ state: FollowState.DECLINED });

    return { followId: existingFollow.id, state: FollowState.DECLINED };
  }

  async followRequests() {
    const currentPersonId = await this.getCurrentPersonId();

    const currentPerson = await this.sequelize.models.people.findOne({
      where: {
        id: currentPersonId,
      },
    });

    return currentPerson.getFollowers({
      joinTableAttributes: ['state'],
      through: { where: { state: { [Op.or]: [FollowState.REQUESTED, null] } } },
    });
  }

  async getCurrentPersonId() {
    const { Auth, Person } = this.context.dataSources;
    const currentPerson = await Auth.getCurrentPerson();

    if (!currentPerson) throw new AuthenticationError('Invalid Credentials');

    return Person.resolveId(currentPerson.id);
  }
}

export { Follow as default };
