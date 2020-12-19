const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Votes extends Model {}

Votes.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    design_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'designs',
        key: 'id',
      },
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'votes',
  }
);

module.exports = Votes;