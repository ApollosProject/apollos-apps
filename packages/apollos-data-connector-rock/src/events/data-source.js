import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import moment from 'moment';

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
      .filter(`Id eq ${id}`)
      .first();
    return event.name;
  };

  getDateTime = async (id) => {
    const schedule = await this.request('Schedules')
      .filter(`Id eq ${id}`)
      .first();
    const iCal = schedule.iCalendarContent;
    const dateTimes = iCal.match(/DTEND:(\w+).*DTSTART:(\w+)/s);
    return [moment(dateTimes[2]).format(), moment(dateTimes[1]).format()];
  };
}
