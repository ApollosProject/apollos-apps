const createJobs = ({ getContext, queues }) => {
  const FullIndexQueue = queues.add('algolia-full-index-queue');

  FullIndexQueue.process(async () => {
    const context = getContext();
    return context.dataSources.Search.indexAll();
  });

  FullIndexQueue.add(null, { repeat: { cron: '15 3 * * *' } });
  // Uncomment this to trigger an index right now.
  // FullIndexQueue.add(null);
};

export default createJobs;
