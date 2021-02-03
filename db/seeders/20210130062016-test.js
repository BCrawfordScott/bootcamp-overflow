'use strict';

const { Users } = require('../models');

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

const annaQuestions = async () => {
  const [ anna ] = await Users.findAll({ where: { email: 'anna@anna.com' }});

  const qs = [
    {
      title: "What's a good way to teach closure?",
      body: "I'm struggling with finding a really good example to teach closure in Javascript.  What is the best way to exemplify the concepts?",
      userId: anna.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  return qs;
}

const brianQuestions = async () => {
  const [ brian ] = await Users.findAll({ where: { email: 'brian@brian.com' } });

  const qs = [
    {
      title: "Why can't I log in?",
      body: "Every time I try to log into progress tracker it gives me a weird error message.  What gives?",
      userId: brian.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "What's the difference between let and var?",
      body: "It seems like let and var do the exact same thing.  What is the difference between them?",
      userId: brian.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  return qs;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {

      const users = await queryInterface.bulkInsert("Users", userFields, { returning: true})
    } catch(err) {
      console.error(err);
    }
    try {
      const aQs = await queryInterface.bulkInsert("Questions", await annaQuestions(), { returning: true })
    } catch (err) {
      console.err(err)
    }
    try {
      const bQs = await queryInterface.bulkInsert("Questions", await brianQuestions(), { returning: true })
    } catch (err) {
      console.err(err)
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Questions', null, {})
    return queryInterface.bulkDelete('Users', null, {});
  }
};
