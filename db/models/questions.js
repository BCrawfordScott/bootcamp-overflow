'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Questions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Questions.belongsTo(models.Users, {
                as: "author",
                foreignKey: "userId",
            });
        }
    };
    Questions.init({
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(280),
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        indexes: [
            {
               unique: true,
               fields: ['title', 'userId'] 
            }
        ],
        sequelize,
        modelName: 'Questions',
    });
    return Questions;
};
