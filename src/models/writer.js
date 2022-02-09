const Sequelize = require('sequelize')
const db = require('../db')

const Writer = db.define('writer', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    imageBanner: {
        type: Sequelize.STRING,
        allowNull: true
    },
    headerColorText: {
        type: Sequelize.STRING,
        allowNull: true
    },
    headerColorBackground: {
        type: Sequelize.STRING,
        allowNull: true
    },
    articleColorText: {
        type: Sequelize.STRING,
        allowNull: true
    },
    articleColorBackground: {
        type: Sequelize.STRING,
        allowNull: true
    },
    allowComments: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, 
{
    timestamps: false
});

module.exports = Writer