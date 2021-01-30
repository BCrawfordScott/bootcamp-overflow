'use strict';

const bcrypt = require('bcryptjs');

const userFields = [
  {
    email: 'anna@anna.com',
    username: 'JoyDancer',
    hashedPassword: bcrypt.hashSync('dancer5678', 10),
    role: 'instructor',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    email: 'brian@brian.com',
    username: 'Bman86',
    hashedPassword: bcrypt.hashSync('starwars', 10),
    role: 'student',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.bulkInsert("Users", userFields, { returning: true})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
