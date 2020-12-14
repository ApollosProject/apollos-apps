import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import moment from 'moment-timezone';
import { get } from 'lodash';

const { ROCK, ROCK_MAPPINGS } = ApollosConfig;
export default class PrayerRequest extends RockApolloDataSource {
  resource = 'PrayerRequests';

  expanded = true;

  getFromId = (id) => this.request().find(id).get();

  byDailyPrayerFeed = async ({ numberDaysSincePrayer = 3 }) => {
    const {
      dataSources: { Auth },
    } = this.context;

    const { primaryAliasId } = await Auth.getCurrentPerson();

    return this.request()
      .filter(`RequestedByPersonAliasId ${'ne'} ${primaryAliasId}`) // don't show your own prayers
      .andFilter(`IsActive eq true`) // prayers can be marked as "in-active" in Rock
      .andFilter(`IsApproved eq true`) // prayers can be moderated in Rock
      .andFilter('IsPublic eq true') // prayers can be set to private in Rock
      .andFilter(
        // prayers that aren't expired
        `ExpirationDate gt datetime'${moment
          .tz(ROCK.TIMEZONE)
          .format()}' or ExpirationDate eq null`
      )
      .andFilter(
        // prayers that were entered less then x days ago
        `EnteredDateTime gt datetime'${moment
          .tz(ROCK.TIMEZONE)
          .subtract(numberDaysSincePrayer, 'day')
          .format()}' or PrayerCount eq null` // include prayers that haven't prayed yet and within x number of days old
      )
      .andFilter(`Answer eq null or Answer eq ''`) // prayers that aren't answered
      .sort([
        { field: 'PrayerCount', direction: 'asc' }, // # of times prayed, ascending
        { field: 'EnteredDateTime', direction: 'asc' }, // oldest prayer first
      ]);
  };

  incrementPrayed = async (id) => {
    this.put(`PrayerRequests/Prayed/${id}`, {});

    // now see if we need to send a push notification informing author
    // that someone prayed for them
    const { Cache } = this.context.dataSources;
    const hasPrayed = await Cache.get({
      key: `prayer:hasPrayed:${id}`,
    });

    if (hasPrayed) return;

    const prayer = await this.getFromId(id);
    if (prayer.prayerCount <= 1) {
      this.sendPrayingNotification(prayer);
    }

    await Cache.set({
      key: `prayer:hasPrayed:${id}`,
      data: true,
    });
  };

  sendPrayingNotification = async ({ requestedByPersonAliasId }) => {
    const notificationText = get(
      ApollosConfig,
      'NOTIFICATIONS.PRAYING',
      'The community is praying for you right now.'
    );
    const { OneSignal } = this.context.dataSources;
    if (!OneSignal) return; // todo: support other push providers
    OneSignal.createNotification({
      toUserIds: [requestedByPersonAliasId],
      content: notificationText,
    });
  };

  flag = async (id) => this.put(`PrayerRequests/Flag/${id}`, {});

  addPrayer = async ({ text, isAnonymous }) => {
    const {
      dataSources: { Auth },
    } = this.context;
    const {
      primaryAliasId,
      nickName,
      firstName,
      lastName,
      email,
      primaryCampusId,
    } = await Auth.getCurrentPerson();

    const prayerId = await this.post('/PrayerRequests', {
      FirstName: nickName || firstName,
      LastName: lastName,
      Email: email,
      Text: text,
      Answer: '',
      CategoryId: ROCK_MAPPINGS.GENERAL_PRAYER_CATEGORY_ID,
      CampusId: primaryCampusId || ROCK_MAPPINGS.WEB_CAMPUS_ID,
      IsPublic: !isAnonymous,
      RequestedByPersonAliasId: primaryAliasId,
      CreatedByPersonAliasId: primaryAliasId,
      IsApproved: true,
      IsActive: true,
      AllowComments: false,
      IsUrgent: false,
      EnteredDateTime: moment().tz(ROCK.TIMEZONE).format(),
      ApprovedOnDateTime: moment().tz(ROCK.TIMEZONE).format(),
      ExpirationDate: moment().tz(ROCK.TIMEZONE).add(2, 'weeks').format(),
    });
    return this.getFromId(prayerId);
  };
}
