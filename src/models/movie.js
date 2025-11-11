'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsTo(models.Genre, {
        foreignKey: 'genre_id',
        as: 'genre',
      });
      Movie.belongsTo(models.User, {
        foreignKey: 'created_by',
        as: 'createdBy',
      });
    }
  }
  Movie.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    year: DataTypes.INTEGER,
    genre_id: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM('movie', 'series'),
      allowNull: false,
    },
    created_by: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM('pending', 'published', 'hidden'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    sequelize,
    modelName: 'Movie',
  });
  return Movie;
};