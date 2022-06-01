const { text } = require('express');
const Interaction = require('../models/interaction');
const errorLog = require('./error.log')

exports.findAll = (req, res) => {
    const articleId = req.params.articleId

    Interaction.findAll({
        where: {articleId: articleId}, 
        order: [
            ['readingDate', 'DESC']
        ]
    }).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        const module = 'Interaction'
        const method = 'registerReading.findAll'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
    })  
}

exports.registerReading = (req, res) => {
    const userId = req.body.userId
    const articleId = req.body.articleId

    Interaction.findOne({
        where: {userId, articleId}
    }).then(data => {
        if (data) {
            res.status(200).send(data)
        } else {
            Interaction.create({
                articleId, 
                userId, 
                readingDate: Date.now()
            }).then(data => {
                res.status(201).send(data)
            }).catch(err => {
                const module = 'Interaction'
                const method = 'registerReading.create'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
            })
        }
    }).catch(err => {
        const module = 'Interaction'
        const method = 'registerReading.findOne'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
    })  
}

exports.putLike = (req, res) => {
    const userId = req.body.userId
    const articleId = req.body.articleId

    Interaction.findOne({
        where: {userId, articleId}
    }).then(data => {
        if (data) {
            const interaction = data
            interaction.like = true
            interaction.likeDate = Date.now()
            interaction.save({fields: ['like', 'likeDate']
            }).then(resp => {
                res.status(201).send(resp)
            }).catch(err => {
                const module = 'Interaction'
                const method = 'putLike.findOne.save'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
            })
        } else {
            Interaction.create({
                articleId, 
                userId, 
                readingDate: Date.now(), 
                like: true, 
                likeDate: Date.now()
            }).then(data => {
                res.status(201).send(data)
            }).catch(err => {
                const module = 'Interaction'
                const method = 'putLike.create'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
            })
        }
    }).catch(err => {
        const module = 'Interaction'
        const method = 'putLike.findOne'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
    })  
}

exports.removeLike = (req, res) => {
    const userId = req.body.userId
    const articleId = req.body.articleId

    Interaction.findOne({
        where: {userId, articleId}
    }).then(data => {
        if (data) {
            const interaction = data
            interaction.like = false
            interaction.likeDate = Date.now()
            interaction.save({fields: ['like', 'likeDate']
            }).then(resp => {
                res.status(201).send(resp)
            }).catch(err => {
                const module = 'Interaction'
                const method = 'removeLike.findOne.save'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
            })
        } else {
            res.status(404).send({message: 'Registro não encontrado.'})
        }
    }).catch(err => {
        const module = 'Interaction'
        const method = 'removeLike.findOne'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
    })  
}
