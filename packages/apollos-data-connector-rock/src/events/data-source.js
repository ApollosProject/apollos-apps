import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import moment from 'moment-timezone';
import ApollosConfig from '@apollosproject/config';
import { get } from 'lodash';

export default class Event extends RockApolloDataSource {
  resource = 'EventItemOccurrences';

  expanded = true;

  getFromId = (id) =>
    this.request().filter(`Id eq ${id}`).expand('Schedule').first();

  getByCampus = (id) =>
    this.findRecent().cache({ ttl: 60 }).filter(`CampusId eq ${id}`).get();

  findRecent = () => {
    let request = this.request();
    if (!get(ApollosConfig, 'ROCK.USE_PLUGIN', false)) {
      console.warn(
        'Fetching public campuses is not possible without the Apollos Plugin\n\nReturning all campuses.'
      );
    } else {
      request = this.request(
        `Apollos/GetEventItemOccurencesByCalendarId?id=${1}`
      );
    }
    return request
      .cache({ ttl: 60 })
      .expand('Schedule')
      .orderBy('Schedule/EffectiveStartDate')
      .filter('Schedule/EffectiveStartDate ne null');
  };

  getName = async ({ eventItemId }) => {
    const event = await this.request('EventItems')
      .cache({ ttl: 60 })
      .find(eventItemId)
      .get();
    return event.name;
  };

  getDescription = async ({ eventItemId }) => {
    const event = await this.request('EventItems')
      .cache({ ttl: 60 })
      .find(eventItemId)
      .get();
    return event.description;
  };

  getImage = async ({ eventItemId }) => {
    const event = await this.request('EventItems')
      .cache({ ttl: 60 })
      .find(eventItemId)
      .get();
    const imageUrl = await this.context.dataSources.BinaryFiles.findOrReturnImageUrl(
      { id: event.photoId }
    );
    if (imageUrl) {
      return {
        sources: [{ uri: imageUrl }],
      };
    }
    return null;
  };

  getDateTime = (schedule) => {
    const iCal = schedule.iCalendarContent;
    const dateTimes = iCal.match(/DTEND:(\w+).*DTSTART:(\w+)/s);
    return {
      start: moment
        .tz(dateTimes[2], ApollosConfig.ROCK.TIMEZONE)
        .utc()
        .format(),
      end: moment.tz(dateTimes[1], ApollosConfig.ROCK.TIMEZONE).utc().format(),
    };
  };
}
