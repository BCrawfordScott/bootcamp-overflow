'use strict';

const { Users, Questions, Answers } = require('../models');

const bcrypt = require('bcryptjs');
const questions = require('../../controllers/questions');

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

const annaAnswers = async () => {
  const anna = await Users.findOne({ where: { email: 'anna@anna.com' } });

  const q1 = await Questions.findOne({ where: { title: 'Why can\'t I log in?' }})
  const q2 = await Questions.findOne({ where: { title: "What's the difference between let and var?" }});

  const answers = [
    {
      body: "You need to make sure that you've linked your Github username to Progress Tracker.  When did you register?",
      instructorId: anna.id,
      questionId: q1.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      body: "Var is function scoped, and will return undefined if you attempt to access a the variable before it's assigned.  Let is block scoped and will throw an error if you attempt to access the variable before it is assigned. We prefer let because it gives us more predictable behavior and descriptive errors.",
      instructorId: anna.id,
      questionId: q2.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return answers;
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
    try {
      await queryInterface.bulkInsert('Answers', await annaAnswers(), {returning: true } );
    } catch(err) {
      console.error(err);
    }
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Answers', null, {})
    await queryInterface.bulkDelete('Questions', null, {})
    return queryInterface.bulkDelete('Users', null, {});
  }
};
