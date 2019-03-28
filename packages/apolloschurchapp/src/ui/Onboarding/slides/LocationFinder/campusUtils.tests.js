import { client } from '../../../../client';
import { getCurrentCampus, requestCurrentCampus } from './campusUtils';

describe('requestCurrentCampus', () => {
  it('must update the store the currentCampus is true', async () => {
    expect(client.readQuery({ query: getCurrentCampus })).toMatchSnapshot(
      'Before calling mutation'
    );

    const result = await requestCurrentCampus({ client });
    expect(result).toEqual(true);
    // this doesn't work yet :(
    // the result is same as above, it looks like the client state isn't loading in time
    expect(client.readQuery({ query: getCurrentCampus })).toMatchSnapshot(
      'After calling mutation'
    );
  });
});
