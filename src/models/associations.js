const Article = require('./article')
const SectionInArticle = require('./sectionInArticle')
const Category = require('./category')

SectionInArticle.belongsTo(Article, {
    constraint: true,
    foreignKey: 'articleId',
    onDelete: 'CASCADE'
})

Article.hasMany(SectionInArticle, {
    constraint: false, 
    foreignKey: 'articleId'
})

Article.belongsTo(Category, {
    constraint: true, 
    foreignKey: 'categoryId'
})

Category.hasMany(Article, {
    constraint: false, 
    foreignKey: 'categoryId'
})
