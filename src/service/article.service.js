require('dotenv').config()

const Article = require('../models/article')
const SectionInArticle = require('../models/sectionInArticle')
const Category = require('../models/category')
const Writer = require('../models/writer')
const {createDefaultWriter} = require('./writer.service')
const validation = require('../config/validation')
const errorLog = require('./error.log')

function createArticleFromReq(req) {
    return new Promise((resolve, reject) => {
        const newArticle = {
            writerId: req.body.writerId,
            title: req.body.title,
            categoryId: req.body.categoryId,
            createdDate: Date.now(),
            status: 'RASCUNHO',
            statusDate: Date.now(),
            htmlFilePath: req.body.htmlFilePath || '',
            route: req.body.route
        }
        Article.create(newArticle)
            .then(data => {
                resolve({status: 200, content: data});
            })
            .catch(err => {
                const module = 'Article'
                const method = 'createArticleFromReq'
                errorLog.log(module, method, err)
                reject({status: 500, message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            });
    })
}

exports.create = (req, res, next) => {
    const writerId = req.body.writerId || ''

    validation.accessValidateUser(writerId, req, res) 
    .then(user => {
        if (user) {
            Writer.findByPk(writerId).then(writer => {
                if (!writer) {
                    createDefaultWriter(writerId)
                    .then(result => {
                        createArticleFromReq(req)
                            .then(result => {
                                res.status(result.status).send(result.content)
                            })
                            .catch(err => {
                                res.status(err.status).send({message: err.message})
                            })
                    })
                    .catch(err => {
                        res.status(err.status).send({message: 'Error trying to insert Writer: ' + err})
                    })
                } else {
                    createArticleFromReq(req)
                    .then(result => {
                        res.status(result.status).send(result.content)
                    })
                    .catch(err => {
                        console.log('Error while creating Article ====>  ', err)
                        res.status(err.status).send({message: err.message})
                    })
                }
            }).catch(err => {
                const module = 'Article'
                const method = 'create.findByPk'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            });
        } else {
            res.status(204).send({message: 'User not found!'})
        }
    })
    .catch(err => {
        res.status(err.status).send({message: err.message})
    })
}

exports.findById = (req, res) => {
    Article.findByPk(req.params.id,
        {order:[
            [ {model: SectionInArticle}, 'sequence']
         ], 
         include: [{model: SectionInArticle}]
        })
        .then(data => {
            if (data) {
                res.status(200).send(data)
            } else {
                res.status(204).send(data)
            }
        })
        .catch(err => {
            const module = 'Article'
            const method = 'findById'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
}


exports.findAll = (req, res) => {
    Article.findAll(
        { where: {status: 'PUBLICADO'},
            order:[ ['createdDate', 'DESC'], 
            [ {model: SectionInArticle}, 'sequence']
         ], 
         include: [{model: SectionInArticle}]
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Article'
        const method = 'findAll'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findAllPublishedByWriter = (req, res) => {
    const writerId = req.params.writerId
    Article.findAll(
        { where: {writerId: writerId, status: 'PUBLICADO'},
            order:[ ['createdDate', 'DESC'], 
            [ {model: SectionInArticle}, 'sequence']
         ], 
         include: [{model: SectionInArticle}]
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Article'
        const method = 'findAll'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findArticlesByWriter = (req, res) => {
    const writerId = req.params.writerId
    Article.findAll({
        where: {writerId: writerId}
    })
    .then(data => {
        if (data) {
            res.status(200).send(data)
        } else {
            res.status(204).send(data)
        }
    })
    .catch(err => {
        const module = 'Article'
        const method = 'findAll'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

function findArticlesByWriterAndStatus (writerId, status) {
    return new Promise((resolve, reject) => {
        const statusToUpperCase = status.toUpperCase()
        Article.findAll({
            where: {writerId: writerId, status: statusToUpperCase}
        })
        .then(data => {
            if (data) {
                resolve({status: 200, content: data});
            } else {
                resolve({status: 204, content: null});
            }
        })
        .catch(err => {
            const module = 'Article'
            const method = 'findArticlesByWriterAndStatus'
            errorLog.log(module, method, err)
            reject({status: 500, message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`});
        });
    })
}

exports.findDraftArticlesByWriter = (req, res) => {
    const writerId = req.params.writerId
    findArticlesByWriterAndStatus(writerId, 'RASCUNHO')
    .then(data => {
        res.status(data.status).send(data.content)
    } )
    .catch(err => {
        res.status(data.status).send(data.message)
    })
}

exports.findUnpublishedArticlesByWriter = (req, res) => {
    const writerId = req.params.writerId
    findArticlesByWriterAndStatus(writerId, 'RETIRADO')
    .then(data => {
        res.status(data.status).send(data.content)
    } )
    .catch(err => {
        res.status(data.status).send(data.message)
    })
}

exports.findPublishedArticlesByWriter = (req, res) => {
    const writerId = req.params.writerId
    findArticlesByWriterAndStatus(writerId, 'PUBLICADO')
    .then(data => {
        res.status(data.status).send(data.content)
    } )
    .catch(err => {
        res.status(data.status).send(data.message)
    })
}

exports.delete = (req, res) => {
    const id = req.params.id

    Article.findOne({
        where: {id: id}
    }).then(data => {
        if (!data) {
            const message = 'Article not found.'
            res.status(204).send({message})
        } else {
            validation.accessValidateUser(data.writerId, req, res) 
            .then(user => {
                if (user) {
                    Article.destroy({
                        where: {id: id}
                    })
                    .then((count) => {
                        console.log('Após Article.destroy ===> ', count)
                        if (count >= 1) {
                            res.status(200).send({message: 'Article successfully removed!'})
                        } else {
                            res.status(204).send({message: 'No Article removed!'})
                        }
                    })
                    .catch(err => {
                        const module = 'Article'
                        const method = 'delete.destroy'
                        errorLog.log(module, method, err)
                        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
                    });
                } else {
                    res.status(204).send({message: 'User not found.'})
                }
            })
            .catch(err => {
                res.status(err.status).send({message: err.message})
            })
        }
    }).catch(err => {
        const module = 'Article'
        const method = 'delete.findOne'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.update = (req, res, next) => {
    const writerId = req.body.writerId
    const articleId = req.body.id

    validation.accessValidateUser(writerId, req, res) 
        .then(data => {
            if (data) {
                Article.findOne({
                    where: {id: articleId}
                }).then(data => {
                    if (data) {
                        let article = data
                        article.writerId = writerId 
                        article.title = req.body.title 
                        article.categoryId = req.body.categoryId 
                        article.htmlFilePath = req.body.htmlFilePath
                        article.route = req.body.route
                        if (req.body.status && ['RASCUNHO', 'PUBLICADO', 'RETIRADO'].includes(req.body.status)) {
                            article.status = req.body.status
                        }
                        article.save({fields: ['title', 'categoryId', 'htmlFilePath', 'route', 'status']
                        }).then(data => {
                            res.status(200).send({message: 'Article successfully updatable!'})
                        }).catch(err => {
                            const module = 'Article'
                            const method = 'update.save'
                            const message = errorLog.log(module, method, err)
                            res.status(500).send({message: `Error in ${method} at ${module}:  ${message}`})
                        });
                    } else {
                        res.status(204).send({message: 'Article not found!'})
                    }
                })
            } else {
                res.status(204).send({message: 'Invalid User!'})
            }
        })
        .catch(err => {
            res.status(500).send({ message:  err.message })
        })
}