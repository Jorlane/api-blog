const Sequelize = require('sequelize')
const db = require('../db')
const Article = require('./article')

const SectionInArticle = db.define('sectionsinarticle', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    sectionId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    imagePath: {
        type: Sequelize.STRING,
        allowNull: true
    },
    complement: {
        type: Sequelize.STRING,
        allowNull: true
    },
    sequence: {
        type: Sequelize.INTEGER, 
        allowNull: true
    }

}, 
{
    timestamps: false
}, 
{
    tableName: 'sectionsinarticle'
}, 
{
    freezeTableName: true
})


module.exports = SectionInArticle