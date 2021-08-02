import { sequelize } from '../../postgres/index';
import * as People from '../../people';
import * as Campus from '../index';
import { setupPostgresTestEnv } from '../../utils/testUtils';

describe('Campus model', () => {
  beforeEach(async () => {
    await setupPostgresTestEnv([Campus, People]);
  });
  afterEach(async () => {
    await sequelize.drop({ cascade: true });
  });

  it('constructs without issues', async () => {
    const campus = await sequelize.models.campus.create({
      name: 'main campus',
      originType: 'rock',
      originId: '1',
    });

    let me = await sequelize.models.people.create({
      firstName: 'Vincent',
      lastName: 'Wilson',
      gender: 'MALE',
      originType: 'rock',
      originId: '1',
    });

    await me.setCampus(campus);

    me = await me.reload();

    expect(me.campusId).toBe(campus.id);
  });
});
