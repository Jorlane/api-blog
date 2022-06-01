const User = require('../models/user')
const errorLog = require('../service/error.log')
const jwt = require('jsonwebtoken')
const authSecret = process.env.AUTH_SECRET

function accessValidateUser(userId, req, res) {
    return new Promise((resolve, reject) => {
        const emailFromToken = req.decoded.email
        User.findByPk(userId)
            .then(user => {
                if (user) {
                    if (!emailFromToken || emailFromToken != user.email) {
                        res.status(403).send({message: 'Acesso negado!'})
                    } else {
                        resolve(user)
                    }
                    
                } else {
                    resolve()
                }
            })
            .catch(err => {
                const module = 'validation'
                const method = 'accessValidateUser'
                errorLog.log(module, method, err)
                res.status(500).send({message: 'Erro ao validar acesso: ' + err.original.sqlMessage})
            })
    })
}

function decodeToken(token) {
    return new Promise((resolve, reject) => {

        jwt.verify(token, authSecret, function(err, decoded) {
            if (err) {
                console.log('ERRO NO jwt.verify ===> ', err)
                reject ({status: 'err', 
                    message: 'Falha ao autenticar token.'
                })
            } else {
                const result = {
                    status: 'ok', 
                    user: decoded 
                }
                resolve(result)
            }
            
        })
    })
}

module.exports = { accessValidateUser, decodeToken }