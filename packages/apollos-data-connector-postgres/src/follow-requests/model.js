import { DataTypes } from 'sequelize';
import { defineModel } from '../postgres';

const createModel = defineModel({
  modelName: 'follow_requests',
  resolveType: () => 'FollowRequest',
  attributes: {
    requestPersonId: DataTypes.UUID,
    followedPersonId: DataTypes.UUID,
    accepted: {
      type: DataTypes.BOOLEAN,
      // null = requested, false = declined, true = accepted
      allowNull: true,
    },
  },
});

export { createModel };
