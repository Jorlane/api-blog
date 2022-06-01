const Sequelize = require('sequelize')
const db = require('../db')

const Comment = db.define('comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATE, 
        allowNull: false
    },
    status: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    dateStatus: {
        type: Sequelize.DATE, 
        allowNull: false
    }
}, 
{
    timestamps: false
});

module.exports = Comment