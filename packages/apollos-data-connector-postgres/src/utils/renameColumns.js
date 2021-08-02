async function renameColumns({ tableName, fields, queryInterface }) {
  return Promise.all(
    fields.map(async (field) => {
      const newFieldName = field
        .split(/(?=[A-Z])/)
        .join('_')
        .toLowerCase();

      return queryInterface.renameColumn(tableName, field, newFieldName);
    })
  );
}

async function revertColumnNames({ tableName, fields, queryInterface }) {
  return Promise.all(
    fields.map(async (field) => {
      const newFieldName = field
        .split(/(?=[A-Z])/)
        .join('_')
        .toLowerCase();

      return queryInterface.renameColumn(tableName, newFieldName, field);
    })
  );
}

export { renameColumns, revertColumnNames };
