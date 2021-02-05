'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Answers extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Answers.belongsTo(models.Users, {
                as: "instructor",
                foreignKey: "instructorId",
            });
            Answers.belongsTo(models.Questions, {
                as: "question",
                foreignKey: "questionId",
            });
        }
    };
    Answers.init({
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        instructorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['instructorId', 'questionId']
            },
            {
                fields: ['instructorId']
            },
            {
                fields: ['questionId']
            }
        ],
        sequelize,
        modelName: 'Answers',
    });
    return Answers;
};
