import ApollosConfig from '@apollosproject/config';
import Pass from './PassGenerator';

describe('PassGenerator', () => {
  it('creates a valid Certificates object', async () => {
    const pass = new Pass({
      model: ApollosConfig.PASS.TEMPLATES.EXAMPLE,
    });

    expect(pass.Certificates).toMatchSnapshot();
  });
});
