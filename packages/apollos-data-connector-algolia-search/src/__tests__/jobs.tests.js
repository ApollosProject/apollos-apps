import createJobs from '../jobs';

const mockJob = {
  process: jest.fn(),
  add: jest.fn(),
  getCompleted: jest.fn(() => []),
};

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
    const deltaIndex = jest.fn();
    const delayedTasks = [];
    mockJob.process = (func) => {
      delayedTasks.push(func);
    };

    createJobs({
      queues,
      getContext: jest.fn(() => ({
        dataSources: { Search: { indexAll, deltaIndex } },
      })),
    });

    // simulate job being called via job runner;
    await Promise.all(delayedTasks.map((task) => task()));

    expect(indexAll.mock.calls).toMatchSnapshot();
  });
});
