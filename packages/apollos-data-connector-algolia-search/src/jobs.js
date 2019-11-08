const createJobs = ({ getContext, queues }) => {
  const FullIndexQueue = queues.add('algolia-full-index-queue');
  const DeltaIndexQueue = queues.add('algolia-delta-index-queue');

  FullIndexQueue.process(async () => {
    const context = getContext();
    return context.dataSources.Search.indexAll();
  });

  DeltaIndexQueue.process(async () => {
    const context = getContext();
    return context.dataSources.Search.deltaIndex({ queue: DeltaIndexQueue });
  });

  FullIndexQueue.add(null, { repeat: { cron: '15 3 * * 1' } });
  DeltaIndexQueue.add(null, { repeat: { cron: '15 3 * * *' } });
  // Uncomment this to trigger an index right now.
  // FullIndexQueue.add(null);
  DeltaIndexQueue.add(null);
};

export default createJobs;
