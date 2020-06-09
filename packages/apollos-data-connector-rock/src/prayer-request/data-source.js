import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import moment from 'moment-timezone';
import { get } from 'lodash';

const { ROCK, ROCK_MAPPINGS } = ApollosConfig;
export default class PrayerRequest extends RockApolloDataSource {
  resource = 'PrayerRequests';

  expanded = true;

  getFromId = (id) =>
    this.request()
      .find(id)
      .get();

  byDailyPrayerFeed = async () => {
    const {
      dataSources: { Auth },
    } = this.context;

    const { primaryAliasId } = await Auth.getCurrentPerson();

    return this.request()
      .filter(`RequestedByPersonAliasId ${'ne'} ${primaryAliasId}`)
      .andFilter(`IsActive eq true`)
      .andFilter(`IsApproved eq true`)
      .andFilter('IsPublic eq true')
      .andFilter(
        `ExpirationDate gt datetime'${moment
          .tz(ROCK.TIMEZONE)
          .format()}' or ExpirationDate eq null`
      )
      .andFilter(
        `EnteredDateTime gt datetime'${moment
          .tz(ROCK.TIMEZONE)
          .subtract(1, 'day')
          .format()}' or ExpirationDate eq null`
      )
      .andFilter(`Answer eq null or Answer eq ''`)
      .sort([
        { field: 'PrayerCount', direction: 'asc' },
        { field: 'EnteredDateTime', direction: 'asc' },
      ]);
  };

  incrementPrayed = async (id) => {
    this.put(`PrayerRequests/Prayed/${id}`, {});

    // now see if we need to send a push notification informing author
    // that someone prayed for them
    const prayer = await this.getFromId(id);
    if (prayer.prayerCount <= 1) this.sendPrayingNotification(prayer);
  };

  sendPrayingNotification = ({ primaryAliasId }) => {
    const notificationText = get(
      ApollosConfig,
      'NOTIFICATIONS.PRAYING',
      'The community is praying for you right now.'
    );
    const { OneSignal } = this.context.dataSources;
    if (!OneSignal) return; // todo: support other push providers
    OneSignal.createNotification({
      toUserIds: [primaryAliasId],
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
      EnteredDateTime: moment()
        .tz(ROCK.TIMEZONE)
        .format(),
      ApprovedOnDateTime: moment()
        .tz(ROCK.TIMEZONE)
        .format(),
      ExpirationDate: moment()
        .tz(ROCK.TIMEZONE)
        .add(2, 'weeks')
        .format(),
    });
    return this.getFromId(prayerId);
  };
}
