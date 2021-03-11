import ApollosConfig from '@apollosproject/config';
import { Op } from 'sequelize';
import { parseGlobalId } from '@apollosproject/server-core/lib/node';
import { AuthenticationError } from 'apollo-server';
import { get } from 'lodash';
import { PostgresDataSource, assertUuid } from '../postgres';
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

  getStaticSuggestedFollowsForCurrentPerson = async () => {
    const { Person } = this.context.dataSources;
    const where = await Person.whereCurrentPerson();
    const currentPerson = await this.sequelize.models.people.findOne({ where });
    return this.getStaticSuggestedFollowsFor(currentPerson);
  };

  getStaticSuggestedFollowsFor = async ({ campusId, id } = {}) => {
    assertUuid(campusId, 'getStaticSuggestedFollowsFor');
    assertUuid(id, 'getStaticSuggestedFollowsFor');

    const suggestedFollowers = get(ApollosConfig, 'SUGGESTED_FOLLOWS', []);
    const suggestedFollowersForCampus = suggestedFollowers.filter((p) => {
      // if the suggested follower has a specific campus.
      if (p.campusId) {
        // match it against the user's campus, if they have a campus
        return !!campusId && p.campusId === campusId;
      }
      // If not, return true.
      return true;
    });

    // Suggested followers is a list of mixed emails strings and objects with an email key.
    const suggestedEmails = suggestedFollowersForCampus.map((p) =>
      p.email ? p.email : p
    );

    // select people.*, follows.state
    // as follow_id from people
    // left outer join follows on (follows."requestPersonId" = 'current user id' and follows."followedPersonId" = people.id)
    // where people.email in ('email list') and (follows.state != 'ACCEPTED' or follows.state is null);

    return this.sequelize.models.people.findAll({
      where: {
        email: { [Op.in]: suggestedEmails },
        id: { [Op.ne]: id },
        '$followingRequests.state$': { [Op.or]: [null, 'REQUESTED'] },
      },
      include: [
        {
          model: this.model,
          as: 'followingRequests',
          required: false,
          where: { requestPersonId: id },
        },
      ],
    });
  };

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
