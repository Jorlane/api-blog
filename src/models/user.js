const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    bioDescription: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    allowEmailNotification: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    frequencyEmailNotification: {
        type: Sequelize.STRING,
        allowNull: true
    },
    firstAccess: {
        type: Sequelize.DATE
    },
    lastAccess: {
        type: Sequelize.DATE
    }, 
    isAdministrator: {
        type: Sequelize.BOOLEAN
    }, 
    commentBlocked: {
        type: Sequelize.BOOLEAN
    }
}, 
{
    timestamps: false
});

module.exports = User