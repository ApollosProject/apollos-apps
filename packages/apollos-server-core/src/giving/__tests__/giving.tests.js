import { useSimpleDonationRoute } from '../index';

describe('Giving', () => {
  it('sends the Giving html route', () => {
    const fns = [];
    const app = {
      get: (path, fn) => {
        fns[path] = fn;
      },
    };
    const res = { setHeader: jest.fn(), send: jest.fn() };

    useSimpleDonationRoute({ app });

    fns['/simpledonation'](null, res);

    expect(res.setHeader.mock.calls).toMatchSnapshot();
    expect(res.send.mock.calls).toMatchSnapshot();
  });
});
