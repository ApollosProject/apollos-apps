import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'comments',
  attributes: {
    text: DataTypes.TEXT,
    // reportCount: {
    //   type: DataTypes.INTEGER,
    //   default: 0
    // }
  },
});

// commentRelations: {
//   originId ||
//   originType
//
//   relatedId
//
//   relationType
//   commentId
// }
//
// commentRelations: {
//   originId: 1
//   originType: "Rock"
//
//   relatedId: null,
//
//   relationType: "Person"
//   commentId: 2
// }
//
// commentRelations: {
//   originId: 1
//   originType: "Rock"
//
//   relatedId: null,
//
//   relationType: "ContentItem"
//   commentId: 2
// }
//
// originId
//
//
// select * from comments where originId === "rockId"
// select * from commentRelations where originId === "rockId" inner join comments commentId = id

export { createModel };
