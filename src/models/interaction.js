const Sequelize = require('sequelize')
const db = require('../db')

const Interaction = db.define('interaction', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    readingDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    like: {
        type: Sequelize.BOOLEAN, 
        allowNull: true
    },
    likeDate: {
        type: Sequelize.DATE, 
        allowNull: true
    }
}, 
{
    timestamps: false
});

module.exports = Interaction