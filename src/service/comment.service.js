const { text } = require('express');
const Comment = require('../models/comment')
const errorLog = require('./error.log')
const User = require('../models/user')
const Article = require('../models/article')

exports.create = (req, res) => {
    const comment = req.body
    if (!comment.text || comment.text.trim() == '') {
      res.status(422).send({
        message: "O texto do comentário é obrigatório!"
      });
      return;
    }

    if (!comment.articleId) {
        res.status(422).send({
            message: "O artigo é obrigatório!"
        })
        return;
    }

    if (!comment.userId) {
        res.status(422).send({
            message: "O usuário é obrigatório!"
        })
        return;
    }

    comment.date = Date.now()
    comment.status = 'REGISTRADO'
    comment.dateStatus = Date.now()
    Comment.create(comment)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            const module = 'Comment'
            const method = 'create'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
            
}

exports.findValidsByArticle = (req, res) => {
    Comment.findAll(
        {   
            where: {articleId: req.params.articleId, status: 'REGISTRADO'},
            order: [
                ['date', 'ASC']
            ], 
            include: [{model: User, attributes: ['name', 'photo']}]
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Comment'
        const method = 'findAllValidByArticle'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findByStatus = (req, res) => {
    Comment.findAll(
        {
            where: {status: req.params.status},
            order: [
                ['date', 'ASC']
            ],
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Comment'
        const method = 'findByStatus'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findById = (req, res) => {
    Comment.findByPk(req.params.id, {
            include: [{model: User, attributes: ['name', 'photo']}, 
                    {model: Article, attributes: ['title']}]
        })
        .then(data => {
            if (data) {
                res.status(200).send(data)
            } else {
                res.status(204).send(null)
            }
        })
        .catch(err => {
            const module = 'Comment'
            const method = 'findById'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
}

exports.update = (req, res) => {
    const id = req.params.id
    
    Comment.findByPk(id)
    .then(data => {
        if (data) {
            const comment = data
            if (req.body.text && req.body.text.trim() != '') {
                comment.text = req.body.text
            } 
            if (req.body.status && req.body.status != '') {
                comment.status = req.body.status
                comment.dateStatus = Date.now()
            }
            comment.save({fields: ['text', 'status', 'dateStatus']}
            ).then(data => {
                res.status(200).send({message: 'Alteração efetuada com sucesso!'})
            }).catch(err => {
                const module = 'Comment'
                const method = 'update.save'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            });
        } else {
            res.status(404).send({message: 'Registro não encontrado!'})
        }
    })
    .catch(err => {
        const module = 'Comment'
        const method = 'update.findByPk'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
       
}

exports.deleteById = (req, res) => {
    const id = req.params.id
    
    Comment.destroy({
        where: {id: id}
    })
    .then((count) => {
        if (count <= 1) {
            res.status(200).send({message: 'Foi excluído ' + count + ' registro.'})
        } else {
            res.status(200).send({message: 'Foram excluídos ' + count + ' registros.'})
        }
    })
    .catch(err => {
        const module = 'Comment'
        const method = 'delete.destroy'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
       
}

exports.deleteByArticle = (req, res) => {
    const articleId = req.params.articleId
    
    Comment.destroy({
        where: {articleId: articleId}
    })
    .then((count) => {
        if (count <= 1) {
            res.status(200).send({message: 'Foi excluído ' + count + ' registro.'})
        } else {
            res.status(200).send({message: 'Foram excluídos ' + count + ' registros.'})
        }
    })
    .catch(err => {
        const module = 'Comment'
        const method = 'deleteByArticle'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
       
}