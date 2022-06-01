const { text } = require('express');
const Connection = require('../models/connection')
const Writer = require('../models/writer')
const errorLog = require('./error.log')
const { decodeToken } = require('../config/validation')

exports.create = (req, res) => {
    const connection = req.body

    Connection.findOne({ where: {userId: req.body.userId, writerId: req.body.writerId }})
    .then(data => {
        if (data) {
            res.status(200).send(data)
        } else {
            connection.startDateConnection = Date.now()
            Connection.create(connection)
            .then(data => {
                res.status(201).send(data);
            })
            .catch(err => {
                const module = 'Connection'
                const method = 'create'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
            }); 
        }
    })
    .catch(err => {
        const module = 'Connection'
        const method = 'create.findOne'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.delete = (req, res) => {
    decodeToken(req.headers.authorization)
    .then(result => {
        Connection.destroy({
            where: {userId: result.user.id, 
                    writerId: req.params.writerId }
        })
        .then(count => {
            if (count > 1) {
                res.status(200).send({message: 'Foram excluídos ' + count + ' registros.'})
            } else {
                res.status(200).send({message: 'Foi excluído ' + count + ' registro.'})
            }
        })
        .catch(err => {
            console.log('Erro => ', err.message)
            const module = 'Connection'
            const method = 'delete'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        })
    })
    .catch(err => {
        console.log('Erro => ', err.message)
        const module = 'Connection'
        const method = 'delete.decodeToken'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
    })
}

exports.findOne = (req, res) => {
    decodeToken(req.headers.authorization)
    .then(result => {
        Connection.findOne(
            {   
                where: {userId: result.user.id, 
                        writerId: req.params.writerId }
            }
        )
        .then(data => {
            if (data) {
                res.status(200).send(data)
            } else {
                res.status(204).send({message: 'Dados não encontrados.'})
            }
        })
        .catch(err => {
            const module = 'Connection'
            const method = 'findOne'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        })
    })
    .catch(err => {
        console.log('Erro => ', err.message)
        const module = 'Connection'
        const method = 'findOne.decodeToken'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
    })
}

exports.findByWriterId = (req, res) => {
    const writerId = req.params.writerId
    Connection.findAll(
        {   
            where: { writerId: writerId }
        }
    )
    .then(data => {
        if (data) {
            res.status(200).send(data)
        } else {
            res.status(204).send({message: 'Dados não encontrados.'})
        }
    })
    .catch(err => {
        const module = 'Connection'
        const method = 'findByWriterId'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findByUserId = (req, res) => {
    const userId = req.params.userId
    Connection.findAll(
        {   
            where: { userId: userId }
        }
    )
    .then(data => {
        if (data) {
            res.status(200).send(data)
        } else {
            res.status(204).send({message: 'Dados não encontrados.'})
        }
    })
    .catch(err => {
        const module = 'Connection'
        const method = 'findByWriterId'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.countFollowers = (req, res) => {
    const writerId = req.params.writerId
    Connection.count({
        where: {writerId: writerId}
    })
    .then(result => res.status(200).send({"count": result}))
    .catch(err => {
        const module = 'Connection'
        const method = 'countFollowers'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
    })
}
