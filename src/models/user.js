'use strict';
const bcrypt = require('bcrypt');


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Definisikan relasi ke role
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });

      User.hasMany(models.Movie, {
        foreignKey: 'created_by',
        as: 'createdBy'
      });
    }
  }
  User.init({
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};