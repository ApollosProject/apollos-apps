import { client } from './testUtils';
import { getPushPermissions } from './permissionUtils';
import { defaults } from './store';

client.writeData({ data: defaults });

describe('getPushPermissions', () => {
  it('should return a boolean based on the result from OneSignal', async () => {
    const result = await getPushPermissions();
    expect(result).toEqual(true);
  });
});
