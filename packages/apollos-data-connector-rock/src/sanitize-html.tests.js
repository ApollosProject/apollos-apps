import sanitizeHtml from './sanitize-html';

describe('the sanitizeHtml function', () => {
  it('returns an empty string with null HTML', () => {
    expect(sanitizeHtml(null)).toMatchSnapshot();
  });
});
