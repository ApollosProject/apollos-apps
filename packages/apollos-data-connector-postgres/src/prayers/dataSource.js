import ApollosConfig from '@apollosproject/config';
import { Op } from 'sequelize';
import { get } from 'lodash';
import { PostgresDataSource } from '../postgres';

class Prayer extends PostgresDataSource {
  modelName = 'prayerRequest';

  async addPrayer({ text, ...args }) {
    const currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();
    const newPrayer = await this.model.findOrCreate({
      where: {
        personId: currentPersonId,
        text,
        ...args,
      },
    });

    return newPrayer[0];
  }

  async byDailyPrayerFeed({ personId, numberDaysSincePrayer = 3, limit = 10 }) {
    const currentPersonId = await this.context.dataSources.Person.getCurrentPersonId();
    const daysSincePosted = new Date();
    daysSincePosted.setDate(daysSincePosted.getDate() - numberDaysSincePrayer);

    const where = {
      id: personId
        ? { [Op.eq]: personId }
        : {
            [Op.ne]: currentPersonId,
          },
    };

    // Filters out multiple prayers from the same user
    function removePrayerDuplicates(prayers) {
      return prayers.filter(
        (prayer, index, self) =>
          index ===
          self.findIndex((t) => prayer.requestor.id === t.requestor.id)
      );
    }

    const prayerRequests = await this.model
      .findAll({
        where: {
          createdAt: {
            [Op.gt]: daysSincePosted,
          },
        },
        include: [
          {
            model: this.sequelize.models.people,
            as: 'requestor',
            where,
            include: {
              model: this.sequelize.models.people,
              as: 'followers',
              where: {
                id: {
                  [Op.eq]: currentPersonId,
                },
              },
              required: false,
            },
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
      })
      .then(removePrayerDuplicates);

    // Sorts prayer requests by users following who the current user is following
    function isFollowingPrayerRequestor(prayer) {
      return prayer.requestor.followers
        .map(({ id }) => id)
        .includes(currentPersonId);
    }
    // We can probably do this through sequelize, this is just to get it working
    const sortedPrayerRequests = prayerRequests.sort((prayerA, prayerB) => {
      const followingA = isFollowingPrayerRequestor(prayerA);
      const followingB = isFollowingPrayerRequestor(prayerB);

      // eslint-disable-next-line no-nested-ternary
      return followingB > followingA ? 1 : followingB < followingA ? -1 : 0;
    });

    return sortedPrayerRequests;
  }

  async incrementPrayed(prayerId) {
    const currentPerson = await this.context.dataSources.Person.getCurrentPerson();
    const prayerRequest = await this.getFromId(prayerId);
    await prayerRequest.addPrayedUser(currentPerson);
    const usersPrayed = await prayerRequest.getPrayedUsers();

    if (usersPrayed.length === 1) {
      this.sendPrayingNotification(prayerRequest.personId);
    }
  }

  sendPrayingNotification = async (personId) => {
    const notificationText = get(
      ApollosConfig,
      'NOTIFICATIONS.PRAYING',
      'The community is praying for you right now.'
    );

    const { Notification } = this.context.dataSources;
    if (!Notification) return; // todo: support other push providers
    Notification.createAndSend({
      title: notificationText,
      personId,
      type: 'PRAYER',
    });
  };
}

export { Prayer as default };
