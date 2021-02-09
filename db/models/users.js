'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    
    isInstructor() {
      return this.role === 'instructor';
    }

    static associate(models) {
      Users.hasMany(models.Questions, {
        as: 'questions',
        foreignKey: 'userId',
      });
      Users.hasMany(models.Answers, {
        as: 'answers',
        foreignKey: 'instructorId',
      })
    }
  };
  Users.init({
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('student', 'instructor'),
      allowNull: false,
      defaultValue: 'student',
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};
