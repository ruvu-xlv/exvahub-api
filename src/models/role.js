'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Definisikan relasi dari sisi Role
      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users'
      });
    }
  }
  Role.init({ 
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Role', 
  });
  return Role;
};