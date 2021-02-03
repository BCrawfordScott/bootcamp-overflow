'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex(
      'Questions',
      ['title', 'userId'],
      {
        name: 'deltas_title_userId',
        unique: true
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex(
      'Questions',
      'deltas_title_userId'
    )
  }
};
