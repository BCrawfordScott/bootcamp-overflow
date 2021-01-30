'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  users.init({
    email: DataTypes.STRING(100),
    username: DataTypes.STRING(100),
    hashedPassword: DataTypes.STRING,
    role: DataTypes.ENUM('student', 'instructor')
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};