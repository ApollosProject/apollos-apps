import ApollosConfig from '@apollosproject/config';
import { Op } from 'sequelize';
import { parseGlobalId } from '@apollosproject/server-core/lib/node';
import { get, partition } from 'lodash';
import { PostgresDataSource, assertUuid } from '../postgres';
import { FollowState } from './model';

class Follow extends PostgresDataSource {
  modelName = 'follows';

  async getCurrentUserFollowingPerson({ id }) {
    assertUuid(id, 'getCurrentUserFollowingPerson');

    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();

    return this.model.findOne({
      where: {
        requestPersonId: currentPersonId,
        followedPersonId: id,
      },
    });
  }

  async getPersonFollowingCurrentUser({ id }) {
    assertUuid(id, 'getPersonFollowingCurrentUser');

    const { Person } = this.context.dataSources;
    const currentPersonId = await Person.getCurrentPersonId();

    return this.model.findOne({
      where: {
        requestPersonId: currentPersonId,
        followedPersonId: id,
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
      return existingFollow.update({ state: FollowState.REQUESTED });
    }

    let initialState = FollowState.REQUESTED;

    // Automatically accept requests to follow suggested people
    const suggested = await this.getStaticSuggestedFollowsForCurrentPerson();
    if (suggested.some((s) => s.id === id)) initialState = FollowState.ACCEPTED;

    // There was no existing request, so lets make one.
    return this.model.create({
      requestPersonId: currentPersonId,
      followedPersonId: id,
      state: initialState,
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

    // Put suggestions with an id into a separate list; we don't want to match them by email
    const [suggestedPeopleById, remainingSuggested] = partition(
      suggestedFollowersForCampus,
      (f) => !!f.id
    );
    const suggestedIds = suggestedPeopleById.map((p) => p.id);

    // Suggested followers is a list of mixed emails strings and objects with an email key.
    const suggestedEmails = remainingSuggested.map((p) =>
      p.email ? p.email : p
    );

    // select people.*, follows.state
    // as follow_id from people
    // left outer join follows on (follows."requestPersonId" = 'current user id' and follows."followedPersonId" = people.id)
    // where (people.email in ('email list') or people.id in ('id list')) and (follows.state != 'ACCEPTED' or follows.state is null);

    return this.sequelize.models.people.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.in]: suggestedEmails } },
          { id: { [Op.in]: suggestedIds } },
        ],
        id: { [Op.ne]: id },
        '$followingRequests.state$': { [Op.or]: [null, FollowState.REQUESTED] },
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
