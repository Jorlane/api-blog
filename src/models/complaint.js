const Sequelize = require('sequelize')
const db = require('../db')

const Complaint = db.define('complaint', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    reason: {
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
    }
}, 
{
    timestamps: false
});

module.exports = Complaint