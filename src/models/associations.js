const Article = require('./article')
const SectionInArticle = require('./sectionInArticle')
const Category = require('./category')
const Comment = require('./comment')
const Interaction = require('./interaction')
const User = require('./user')
const Complaint = require('./complaint')
const Connection = require('./connection')
const Writer = require('./writer')

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

Comment.belongsTo(Article, {
    constraint: true, 
    foreignKey: {
        name: 'articleId', 
        allowNull: false
    }
})

Article.hasMany(Comment, {
    constraint: false, 
    foreignKey: {
        name: 'articleId', 
        allowNull: false
    }
})

Comment.belongsTo(User, {
    constraint: true, 
    foreignKey: {
        name: 'userId', 
        allowNull: false
    }
})

User.hasMany(Comment, {
    constraint: false, 
    foreignKey: {
        name: 'userId', 
        allowNull: false
    }
})

Interaction.belongsTo(Article, {
    constraint: true, 
    foreignKey: {
        name: 'articleId', 
        allowNull: false
    }
})

Article.hasMany(Interaction, {
    constraint: true, 
    foreignKey: {
        name: 'articleId', 
        allowNull: false
    }
})

Interaction.belongsTo(User, {
    constraint: true, 
    foreignKey: {
        name: 'userId', 
        allowNull: false
    }
})

User.hasMany(Interaction, {
    constraint: true, 
    foreignKey: {
        name: 'userId', 
        allowNull: false
    }
})

Complaint.belongsTo(Comment, {
    constraint: true, 
    foreignKey: {
        name: 'commentId',
        allowNull: false
    }
})

Comment.hasMany(Complaint, {
    constraint: true, 
    foreignKey: {
        name: 'commentId', 
        allowNull: false
    }
})

Connection.belongsTo(User, {
    constraint: true, 
    foreignKey: {
        name: 'userId', 
        allowNull: false
    }
})

User.hasMany(Connection, {
    constraint: true, 
    foreignKey: {
        name: 'userId', 
        allowNull: false
    }
})

Connection.belongsTo(Writer, {
    constraint: true, 
    foreignKey: {
        name: 'writerId', 
        allowNull: false
    }
})

Writer.hasMany(Connection, {
    constraint: true, 
    foreignKey: {
        name: 'writerId', 
        allowNull: false
    }
})