import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import moment from 'moment-timezone';
import ApollosConfig from '@apollosproject/config';

export default class Event extends RockApolloDataSource {
  resource = 'EventItemOccurrences';

  expanded = true;

  getById = (id) =>
    this.request()
      .find(id)
      .get();

  getByCampus = (id) =>
    this.request()
      .filter(`CampusId eq ${id}`)
      .get();

  getName = async (id) => {
    const event = await this.request('EventItems')
      .find(id)
      .get();
    return event.name;
  };

  getDateTime = async (id) => {
    const schedule = await this.request('Schedules')
      .find(id)
      .get();
    const iCal = schedule.iCalendarContent;
    const dateTimes = iCal.match(/DTEND:(\w+).*DTSTART:(\w+)/s);
    return {
      start: moment
        .tz(dateTimes[2], ApollosConfig.ROCK.TIMEZONE)
        .utc()
        .format(),
      end: moment
        .tz(dateTimes[1], ApollosConfig.ROCK.TIMEZONE)
        .utc()
        .format(),
    };
  };
}
