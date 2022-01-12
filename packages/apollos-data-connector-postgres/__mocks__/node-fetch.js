let response;

export const setResponse = (r) => (response = r);

const mock = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(response),
  })
);

export default mock;
