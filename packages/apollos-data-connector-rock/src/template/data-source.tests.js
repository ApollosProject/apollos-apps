import { createTestHelpers } from '@apollosproject/server-core/lib/testUtils';
import { fetch } from 'apollo-server-env';
import { Auth, Person } from '../index';

import Template from './data-source';

const { getContext } = createTestHelpers({
  Person,
  Auth,
  Template: { dataSource: Template },
});

describe('Template (Lava) Data Source', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockRockDataSourceAPI();
  });

  it('renders a template', async () => {
    const context = getContext();
    context.userToken = 'some-token';
    context.rockCookie = 'some-cookie';
    const result = await context.dataSources.Template.renderTemplate({
      template: '{{ someLavaCode }}',
    });

    expect(result).toMatchSnapshot();
  });

  it('requires a currentPerson', async () => {
    const context = getContext();

    const result = context.dataSources.Template.renderTemplate({
      template: '{{ someLavaCode }}',
    });

    expect(result).rejects.toMatchSnapshot();
  });

  it('accepts a currentPersonId argument', async () => {
    const context = getContext();

    const result = await context.dataSources.Template.renderTemplate({
      template: '{{ someLavaCode }}',
      currentPersonId: 5,
    });

    expect(result).toMatchSnapshot();
  });
});
