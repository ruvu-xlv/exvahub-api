'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Episode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Episode.belongsTo(models.Movie, {
        foreignKey: 'movie_id',
        as: 'movie',
      });
    }
  }
  Episode.init({
    movie_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    episode_number: DataTypes.INTEGER,
    video_url: DataTypes.STRING,
    source_type: {
      type: DataTypes.ENUM('upload', 'external'),
      allowNull: false,
    },
    duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Episode',
  });
  return Episode;
};