import createJobs from '../jobs';

const mockJob = { process: jest.fn(), add: jest.fn() };

const queues = {
  add: jest.fn(() => mockJob),
};

describe('Alolia search jobs', () => {
  it('must create a job and add it to the queue', () => {
    createJobs({ queues });

    expect(mockJob.process.mock.calls).toMatchSnapshot();
    expect(mockJob.add.mock.calls).toMatchSnapshot();
    expect(queues.add.mock.calls).toMatchSnapshot();
  });

  it('process must call a Search datasource method', async () => {
    const indexAll = jest.fn();
    let delayedTask;
    mockJob.process = (func) => {
      delayedTask = func;
    };

    createJobs({
      queues,
      getContext: jest.fn(() => ({
        dataSources: { Search: { indexAll } },
      })),
    });

    // simulate job being called via job runner;
    await delayedTask();

    expect(indexAll.mock.calls).toMatchSnapshot();
  });
});
