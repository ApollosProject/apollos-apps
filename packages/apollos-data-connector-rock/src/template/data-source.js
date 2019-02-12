import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import { AuthenticationError } from 'apollo-server';

export default class Template extends RockApolloDataSource {
  renderTemplate = async ({ template, currentPersonId }) => {
    const personId =
      currentPersonId ||
      (await this.context.dataSources.Auth.getCurrentPerson()).id;

    if (!personId)
      throw new AuthenticationError(
        'Must provide a `currentPersonId` context or be logged in'
      );

    const templateWithContext = `{% person id:'${personId}' %}${template}{% endperson %}`;
    const result = await this.post('Lava/RenderTemplate', {
      template: templateWithContext,
    });
    return JSON.parse(result).template;
  };
}
