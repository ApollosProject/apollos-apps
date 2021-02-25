import { DataTypes } from 'sequelize';
import { defineModel } from '../postgres';

const createModel = defineModel({
  modelName: 'follow-requests',
  resolveType: () => 'FollowRequest',
  attributes: {
    requestPersonId: DataTypes.INTEGER,
    followedPersonId: DataTypes.INTEGER,
    accepted: {
      type: DataTypes.BOOLEAN,
      // null = requested, false = declined, true = accepted
      allowNull: true,
    },
  },
});

export { createModel };
