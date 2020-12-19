const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Videos extends Model {}

Videos.init(
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
      video_link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'videos',
  }
);

module.exports = Videos;