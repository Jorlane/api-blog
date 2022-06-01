const Sequelize = require('sequelize')
const db = require('../db')

const Connection = db.define('connection', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    startDateConnection: {
        type: Sequelize.DATE, 
        allowNull: false
    },
    finishDateConnection: {
        type: Sequelize.DATE, 
        allowNull: true
    }
}, 
{
    timestamps: false
});

module.exports = Connection