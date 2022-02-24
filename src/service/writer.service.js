require('dotenv').config()

const Writer = require('../models/writer')
const Article = require('../models/article')

const validation = require('../config/validation')
const errorLog = require('./error.log')

exports.createDefaultWriter = (userId) => {
    return new Promise(function(resolve, reject) {
        const newWriter = {
            userId, 
            imageBanner: null, 
            headerColorText: '#000', 
            headerColorBackground: '#eee', 
            articleColorText: '#000', 
            articleColorBackground: '#eee', 
            allowComments: true
        }
        Writer.create(newWriter)
            .then(data => {
                resolve({status: 200, content: data});
            })
            .catch(err => {
                const module = 'Writer'
                const method = 'createDefaultWriter'
                errorLog.log(module, method, err)
                reject({status: 500, content: err.original.sqlMessage});
            });
    })
}

exports.create = (req, res, next) => {
    const userId = req.body.userId || ''
    
    validation.accessValidateUser(userId, req, res) 
        .then(
            Writer.findByPk(userId)
            .then(writer => {
                if (writer) {
                    res.status(400).send({message: 'Escritor já cadastrado.'})
                } else {
                    const newWriter = {
                        userId, 
                        imageBanner: null, 
                        headerColorText: req.body.headerColorText || '#000', 
                        headerColorBackground: req.body.headerColorBackground || '#eee', 
                        articleColorText: req.body.articleColorText || '#000', 
                        articleColorBackground: req.body.articleColorBackground || '#eee', 
                        allowComments: req.body.allowComments || true
                    }
                    Writer.create(newWriter)
                        .then(data => {
                            res.status(200).send(data)
                        })
                        .catch(err => {
                            const module = 'Writer'
                            const method = 'create'
                            errorLog.log(module, method, err)
                            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
                        });
                }
            })
            .catch(err => {
                const module = 'Writer'
                const method = 'create.findByPk'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            })
        )
}

exports.findById = (req, res) => {
    Writer.findByPk(req.params.userId)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            const module = 'Writer'
            const method = 'findById'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
}

exports.findAll = (req, res) => {
    Writer.findAll(
        { order: [
                ['userId', 'ASC']
            ],
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Writer'
        const method = 'findAll'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.delete = (req, res) => {
    const userId = req.params.userId
    validation.accessValidateUser(userId, req, res) 
        .then(
            Article.findOne({
                where: {writerId: userId}
            })
            .then(data => {
                if (data) {
                    const message = 'Exclusão de escritor não permitida por conter artigo(s).'
                    res.status(422).send({message})
                } else {
                    Writer.destroy({
                        where: {userId: userId}
                    })
                    .then((count) => {
                        if (count <= 1) {
                            res.status(200).send({message: 'Foi excluído ' + count + ' registro.'})
                        } else {
                            res.status(200).send({message: 'Foram excluídos ' + count + ' registros.'})
                        }
                    })
                    .catch(err => {
                        const module = 'Writer'
                        const method = 'delete.destroy'
                        errorLog.log(module, method, err)
                        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
                    });
                }
            })
            .catch(err => {
                const module = 'Writer'
                const method = 'delete.findOne'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            })
        )
}