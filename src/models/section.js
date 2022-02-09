const Sequelize = require('sequelize')
const db = require('../db')

const Section = db.define('section', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
})

module.exports = Section