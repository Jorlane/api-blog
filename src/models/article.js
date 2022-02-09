const Sequelize = require('sequelize')
const db = require('../db')
const Category = require('./category')
const SectionInArticle = require('./sectionInArticle')

const Article = db.define('article', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    writerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    statusDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    htmlFilePath: {
        type: Sequelize.STRING,
        allowNull: false
    },
    route:  {
        type: Sequelize.STRING,
        allowNull: false
    }
}, 
{
    timestamps: false
})

module.exports = Article