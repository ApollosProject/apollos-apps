import Bull from 'bull';

const createJobs = ({ getContext }) => {
  const FullIndexQueue = new Bull('algolia-full-index-queue');

  FullIndexQueue.process(async (job, data) => {
    const context = getContext();
    dataSources.Search.indexAll();
  });
};

export default createJobs;
