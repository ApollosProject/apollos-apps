import { isApollosId, PostgresDataSource } from '../postgres';

class PersonDataSource extends PostgresDataSource {
  modelName = 'people';

  resolveId = async (id) => {
    const { Auth } = this.context.dataSources;

    if (!isApollosId(id) && Auth.ORIGIN_TYPE) {
      const person = await this.model.findOne({
        where: {
          originId: id.toString(),
          originType: Auth.ORIGIN_TYPE,
        },
      });

      if (!person) throw new Error(`Invalid user Id ${id}`);

      return person.id;
    }

    return id;
  };
}

export { PersonDataSource as default };
