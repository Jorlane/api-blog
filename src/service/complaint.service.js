const { text } = require('express');
const Complaint = require('../models/complaint')
const Comment = require('../models/comment')
const errorLog = require('./error.log')

exports.create = (req, res) => {
    const complaint = req.body
    if (!complaint.reason || complaint.reason.trim() == '') {
        res.status(422).send({
            message: "O motivo da denúncia é obrigatório!"
        });
        return;
    }

    if (!complaint.commentId) {
        res.status(422).send({
            message: "A identificação do comentário é obrigatória!"
        })
        return;
    }

    complaint.date = Date.now()
    complaint.status = 'PENDENTE'
    Complaint.create(complaint)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            const module = 'Complaint'
            const method = 'create'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        }); 
}

exports.findAllPending = (req, res) => {
    Complaint.findAll(
        {   
            where: {status: 'PENDENTE'},
            order: [
                ['date', 'ASC']
            ], 
            include: [{model: Comment}]
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Complaint'
        const method = 'findAllPending'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findAll = (req, res) => {
    Complaint.findAll(
        {   
            order: [
                ['date', 'ASC']
            ], 
            include: [{model: Comment}]
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Complaint'
        const method = 'findAll'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findByStatus = (req, res) => {
    Complaint.findAll(
        {
            where: {status: req.params.status},
            order: [
                ['date', 'DESC']
            ],
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Complaint'
        const method = 'findByStatus'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findById = (req, res) => {
    Complaint.findByPk(req.params.id)
        .then(data => {
            if (data) {
                res.status(200).send(data)
            } else {
                res.status(204).send(null)
            }
        })
        .catch(err => {
            const module = 'Complaint'
            const method = 'findById'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
}

exports.update = (req, res) => {
    const id = req.params.id
    
    Complaint.findByPk(id)
    .then(data => {
        if (data) {
            const complaint = data
            if (req.body.status && req.body.status != '') {
                complaint.status = req.body.status
            }
            complaint.save({fields: ['status']}
            ).then(data => {
                res.status(200).send({message: 'Alteração efetuada com sucesso!'})
            }).catch(err => {
                const module = 'Complaint'
                const method = 'update.save'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            });
        } else {
            res.status(404).send({message: 'Registro não encontrado!'})
        }
    })
    .catch(err => {
        const module = 'Complaint'
        const method = 'update.findByPk'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
       
}