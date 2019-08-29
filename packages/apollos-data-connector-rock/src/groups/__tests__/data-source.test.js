import GroupsDataSource from '../data-source';

describe('Groups', () => {
  const personArrayMock = Promise.resolve([
    { id: 1, firstName: 'Frank' },
    { id: 2, firstName: 'Michael' },
  ]);
  const personMock = Promise.resolve({ id: 1, firstName: 'Frank' });
  const groupArrayMock = Promise.resolve([
    { id: 1, name: 'franks beer group' },
  ]);
  const groupMock = Promise.resolve({
    id: 1,
    name: 'franks beer group',
    isActive: true,
    isArchived: false,
  });

  class GroupsWithContext extends GroupsDataSource {
    context = {
      dataSources: {
        Person: {
          getFromId: jest.fn(() => ({ id: 1, firstName: 'Frank' })),
        },
      },
    };
  }
  let Groups;
  beforeEach(() => {
    Groups = new GroupsWithContext();
  });

  it('should get all groups', async () => {
    Groups.get = jest.fn(() => groupArrayMock);

    const result = await Groups.getAll();
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });

  it('should get a group by id', async () => {
    Groups.get = jest.fn(() => groupMock);

    const result = await Groups.getFromId(1);
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });

  it('should get group members', async () => {
    Groups.get = jest.fn(() => personArrayMock);

    const result = await Groups.getMembers(1);
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });

  it('should get the leader', async () => {
    Groups.request = () => ({
      filter: () => ({
        andFilter: () => ({
          expand: () => ({
            first: jest.fn(() => personMock),
          }),
        }),
      }),
    });

    const result = await Groups.getLeader(1);
    expect(result).toMatchSnapshot();
  });

  it('should get groups by person', async () => {
    Groups.get = jest.fn(() => personArrayMock);
    Groups.getFromId = jest.fn(() => groupMock);

    const result = await Groups.getByPerson(1);
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });

  it('should get families', async () => {
    Groups.get = jest.fn(() => groupArrayMock);

    const result = await Groups.getFamilies(1);
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });
});
