const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Images extends Model {}

Images.init(
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
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'images',
  }
);

module.exports = Images;