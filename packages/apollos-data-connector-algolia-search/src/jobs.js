import ApollosConfig from '@apollosproject/config';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';

const { ROCK } = ApollosConfig;

const createJobs = ({ getContext, queues }) => {
  const FullIndexQueue = queues.add('algolia-full-index-queue');
  const DeltaIndexQueue = queues.add('algolia-delta-index-queue');

  FullIndexQueue.process(async () => {
    const context = getContext();
    return context.dataSources.Search.indexAll();
  });

  DeltaIndexQueue.process(async () => {
    const context = getContext();
    const jobs = await DeltaIndexQueue.getCompleted();
    const timestamp = isEmpty(jobs)
      ? moment()
          .subtract(1, 'day')
          .toDate()
      : jobs
          .map((j) => j.opts.timestamp)
          .sort((a, b) => {
            if (a > b) {
              return -1;
            }
            if (a < b) {
              return 1;
            }
            return 0;
          })[0];
    const datetime = moment(timestamp)
      .tz(ROCK.TIMEZONE)
      .format()
      .split(/[-+]\d+:\d+/)[0];
    return context.dataSources.Search.deltaIndex({ datetime });
  });

  FullIndexQueue.add(null, { repeat: { cron: '15 3 * * 1' } });
  DeltaIndexQueue.add(null, { repeat: { cron: '15 3 * * *' } });
  // Uncomment this to trigger an index right now.
  // FullIndexQueue.add(null);
  // DeltaIndexQueue.add(null);
};

export default createJobs;
