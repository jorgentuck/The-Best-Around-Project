const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Instructions extends Model {}

Instructions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    design_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'designs',
          key: 'id',
        },
      },
      sequence: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'Instructions',
  }
);

module.exports = Instructions;