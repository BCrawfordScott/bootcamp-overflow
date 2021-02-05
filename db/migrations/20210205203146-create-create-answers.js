'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
 

      await queryInterface.createTable("Answers", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        body: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        questionId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Questions",
            key: 'id'
          },
        },
        instructorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: 'id'
          },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })

      await queryInterface.addIndex(
          "Answers",
          ['questionId'],
          {
            name: 'answer_question_index'
          }
        );

      await queryInterface.addIndex(
          "Answers",
          ['instructorId'],
          {
            name: 'answer_instructor_index'
          }
        );
 

      await queryInterface.addIndex(
          "Answers",
          ['questionId', 'instructorId'],
          {
            name: 'delta_instructor_question_index',
            unique: true
          }
        );

    
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex(
      'Answers',
      'delta_instructor_question_index'
    );
    await queryInterface.removeIndex(
      'Answers',
      'answer_instructor_index'
    );
    await queryInterface.removeIndex(
      'Answers',
      'answer_question_index'
    );
    await queryInterface.dropTable('Answers');
  }
};
