'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex(
      'Questions',
      ['title', 'userId'],
      {
        indicesType: 'UNIQUE'
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex(
      'Questions',
      ['title', 'userId'],
    )
  }
};
