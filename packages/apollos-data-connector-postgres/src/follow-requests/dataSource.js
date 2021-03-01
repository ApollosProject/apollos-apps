import { AuthenticationError } from 'apollo-server';
import { PostgresDataSource } from '../postgres';

class FollowRequestDataSource extends PostgresDataSource {
  modelName = 'follow-requests';

  async requestFollow({ followedPersonId }) {
    const { Auth, PersonApollos } = this.context.dataSources;
    const currentPerson = await Auth.getCurrentPerson();

    if (!currentPerson) throw new AuthenticationError('Invalid Credentials');

    const requestPersonId = await PersonApollos.resolveId(currentPerson.id);

    const existingRequest = await this.model.findOne({
      where: {
        requestPersonId,
        followedPersonId,
      },
    });

    if (existingRequest) {
      const { dataValues } = existingRequest;
      if (dataValues.accepted) {
        // The request was already accepted.
        return { following: true };
      }

      // If a request already exists that was denied, update it as a new request.
      await existingRequest.update({ accepted: null });
    } else {
      // There was no existing request, so lets make one.
      await this.model.create({
        requestPersonId,
        followedPersonId,
      });
    }

    return { following: false };
  }
}

export { FollowRequestDataSource as default };
