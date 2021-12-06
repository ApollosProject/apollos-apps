import { Op } from 'sequelize';
import { parseGlobalId } from '@apollosproject/server-core/lib/node';
import { generateAppLink } from '@apollosproject/server-core';
import ApollosConfig from '@apollosproject/config';
import { partition } from 'lodash';
import { PostgresDataSource, assertUuid } from '../postgres';
import { FollowState } from './model';

class Follow extends PostgresDataSource {
  modelName = 'follows';

  async getCurrentUserFollowingPerson({ id, followingRequests }) {
    assertUuid(id, 'getCurrentUserFollowingPerson');

    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();

    // Patch for eager loading data.
    // Lets us skip a step if we have already joined
    if (Array.isArray(followingRequests)) {
      return followingRequests.find(
        ({ requestPersonId }) => requestPersonId === currentPersonId
      );
    }

    return this.model.findOne({
      where: {
        requestPersonId: currentPersonId,
        followedPersonId: id,
      },
    });
  }

  async getPersonFollowingCurrentUser({ id, requestedFollows }) {
    assertUuid(id, 'getPersonFollowingCurrentUser');

    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();

    // Patch for eager loading data.
    // Lets us skip a step if we have already joined
    if (Array.isArray(requestedFollows)) {
      return requestedFollows.find(
        ({ followedPersonId }) => followedPersonId === currentPersonId
      );
    }

    return this.model.findOne({
      where: {
        requestPersonId: id,
        followedPersonId: currentPersonId,
      },
    });
  }

  // eslint-disable-next-line consistent-return
  async requestFollow({ followedPersonId }) {
    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();

    const { id } = parseGlobalId(followedPersonId);

    const existingFollow = await this.model.findOne({
      where: {
        requestPersonId: currentPersonId,
        followedPersonId: id,
      },
    });

    if (existingFollow) {
      const { dataValues } = existingFollow;

      if (dataValues.state === FollowState.ACCEPTED) {
        // The request was already accepted.
        return existingFollow;
      }

      // If a request already exists that was denied, update it as a new request.
      this.sendRequestFollowNotification({
        followedPersonId: id,
        requestPersonId: currentPersonId,
      });
      return existingFollow.update({ state: FollowState.REQUESTED });
    }

    let initialState = FollowState.REQUESTED;

    // Automatically accept requests to follow suggested people
    const suggested = await this.getStaticSuggestedFollowsForCurrentPerson();
    if (suggested.some((s) => s.id === id)) initialState = FollowState.ACCEPTED;

    // We shouldn't send push notifications to auto-accepting users
    if (initialState !== FollowState.ACCEPTED) {
      this.sendRequestFollowNotification({
        followedPersonId: id,
        requestPersonId: currentPersonId,
      });
    }

    // There was no existing request, so lets make one.
    return this.model.create({
      requestPersonId: currentPersonId,
      followedPersonId: id,
      state: initialState,
    });
  }

  async sendRequestFollowNotification({ followedPersonId, requestPersonId }) {
    const { Person } = this.context.dataSources;

    const followedPerson = await Person.getFromId(followedPersonId);
    const requestPerson = await Person.getFromId(requestPersonId);

    return this.context.dataSources.OneSignal.createNotification({
      content: `${requestPerson.firstName} ${requestPerson.lastName} has asked to follow you.`,
      to: followedPerson,
      data: {
        requestPersonId: requestPerson.apollosId,
        url: generateAppLink('deep', 'nav', { screen: 'connect' }),
      },
      buttons: [
        {
          id: `acceptFollowRequest`,
          text: 'Confirm',
        },
      ],
    });
  }

  async acceptFollowRequest({ requestPersonId }) {
    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();

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

    const updatedModel = await existingFollow.update({
      state: FollowState.ACCEPTED,
    });

    return updatedModel;
  }

  async ignoreFollowRequest({ requestPersonId }) {
    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();

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

    const updatedModel = await existingFollow.update({
      state: FollowState.DECLINED,
    });

    return updatedModel;
  }

  async unfollowPerson({ followedPersonId }) {
    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();
    const { id } = parseGlobalId(followedPersonId);

    return this.model.destroy({
      where: {
        followedPersonId: id,
        requestPersonId: currentPersonId,
      },
    });
  }

  getStaticSuggestedFollowsForCurrentPerson = async () => {
    const { Person } = this.context.dataSources;
    const where = await Person.whereCurrentPerson();
    const currentPerson = await this.sequelize.models.people.findOne({ where });
    return this.getStaticSuggestedFollowsFor(currentPerson);
  };

  getStaticSuggestedFollowsFor = async (currentPerson) => {
    assertUuid(currentPerson.campusId, 'getStaticSuggestedFollowsFor');
    assertUuid(currentPerson.id, 'getStaticSuggestedFollowsFor');

    const suggestions = ApollosConfig.SUGGESTED_FOLLOWS ?? [];
    if (!suggestions.length) return [];

    const suggestionsByCampus = suggestions.filter(({ campusId }) => {
      // if the suggested follower has a specific campus.
      if (campusId) {
        // match it against the user's campus, if they have a campus
        return !!currentPerson.campusId && campusId === currentPerson.campusId;
      }
      // If not, return true.
      return true;
    });

    // Put suggestions with an id into a separate list; we don't want to match them by email
    const [suggestedPeopleById, remainingSuggested] = partition(
      suggestionsByCampus,
      ({ id }) => !!id
    );
    const suggestedIds = suggestedPeopleById.map(({ id }) => id);

    // Suggested followers is a list of mixed emails strings and objects with an email key.
    const suggestedEmails = remainingSuggested.map(({ email }) => email);

    return this.sequelize.models.people.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.in]: suggestedEmails } },
          { id: { [Op.in]: suggestedIds } },
        ],
        id: { [Op.ne]: currentPerson.id },
        '$followingRequests.state$': { [Op.or]: [null, FollowState.REQUESTED] },
      },
      include: [
        {
          model: this.model,
          as: 'followingRequests',
          required: false,
          where: { requestPersonId: currentPerson.id },
        },
      ],
    });
  };

  async followRequests() {
    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();

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
}

export { Follow as default };
