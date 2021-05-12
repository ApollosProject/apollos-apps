import GroupsDataSource from '../data-source';

describe('Groups', () => {
  const personArrayMock = Promise.resolve([
    { id: 1, firstName: 'Frank' },
    { id: 2, firstName: 'Michael' },
  ]);
  // May need later
  // const personMock = Promise.resolve({ id: 1, firstName: 'Frank' });
  const groupMock = Promise.resolve({
    id: 1,
    name: 'franks beer group',
    groupTypeId: 25,
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

  it('should get a group by id', async () => {
    Groups.get = jest.fn(() => groupMock);

    const result = await Groups.getFromId({ id: 1 });
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });

  it('should get group members', async () => {
    Groups.get = jest.fn(() => personArrayMock);

    const result = await Groups.getMembers(1);
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });

  it('should get the leaders', async () => {
    Groups.request = () => ({
      filter: () => ({
        andFilter: () => ({
          expand: () => ({
            get: jest.fn(() => personArrayMock),
          }),
        }),
      }),
    });

    const result = await Groups.getLeaders(1);
    expect(result).toMatchSnapshot();
  });

  it('should get groups by person', async () => {
    Groups.get = jest.fn(() => personArrayMock);
    Groups.getFromId = jest.fn(() => groupMock);

    const result = await Groups.getByPerson({ personId: 1 });
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });
});
