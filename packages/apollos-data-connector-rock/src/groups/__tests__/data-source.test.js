import GroupsDataSource from '../data-source';

describe('Groups', () => {
  let Groups;
  beforeEach(() => {
    Groups = new GroupsDataSource();
  });

  it('should get all groups', async () => {
    Groups.get = jest.fn(() =>
      Promise.resolve([{ id: 1, name: 'franks beer group' }])
    );

    const result = await Groups.getAll();
    expect(result).toMatchSnapshot();
    expect(Groups.get.mock.calls).toMatchSnapshot();
  });
});
