import { AuthenticationError }  from 'apollo-server';
import FormData                 from 'form-data';
import { camelCase, mapKeys }   from 'lodash';
import RockApolloDataSource     from '@apollosproject/rock-apollo-data-source';

export default class Group extends RockApolloDataSource {
  resource = 'Groups';

  getFromGuid = (guid) => 
    this.request()
      .find(`Guid eq (guid'${guid}')`)
      .get();

  /**
   * TODO : add proper support for checking Int v Guid
   *      : move Int v Guid checking to data-source
   */
  getChildrenFromParentId = (id) => 
    this.request()
      .filter(`ParentGroupId eq ${id}`)
      .get();

  getFromId = (id) => {
    if (!id) return false;

    const regexNotDigit = /\D/g;
    const idNotNumber = id.match(regexNotDigit);

    return (idNotNumber ?
      this.getFromGuid(id) :
      this.request()
        .find(id)
        .get()
    );
  }

  getGroups = () => 
    this.request()
      .get();
}
