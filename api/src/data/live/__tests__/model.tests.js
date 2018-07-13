import fetch from 'isomorphic-fetch';
import LiveStream from '../model';
// import RockConnector from '../../../connectors/rock';

describe('LiveStream', () => {
  // let context;
  beforeEach(() => {
    fetch.resetMocks();
    // context = {
    //   connectors: {
    //     Rock: new RockConnector(),
    //   },
    // };
  });
  it('constructs', () => {
    expect(new LiveStream()).toBeTruthy();
  });
  it('returns the LiveStream resource', () => {
    fetch.mockResponse(JSON.stringify({ isLiveNow: true }));
    const model = new LiveStream();
    expect(model.resource).toMatchSnapshot();
  });
});
