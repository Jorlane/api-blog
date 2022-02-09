const Sequelize = require('sequelize')
const db = require('../db')

const Category = db.define('category', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoryParent: {
        type: Sequelize.INTEGER
    },
    initDate: {
        type: Sequelize.DATE, 
        allowNull: false
    },
    endDate: {
        type: Sequelize.DATE
    }
     
}, 
{
    timestamps: false
});

module.exports = Category