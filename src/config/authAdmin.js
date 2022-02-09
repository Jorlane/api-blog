require('dotenv').config()

const jwt = require('jsonwebtoken')

const authSecret = process.env.AUTH_SECRET
const environment = process.env.ENVIRONMENT

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    } else {
        const token = req.body.token || req.query.token || req.headers['authorization']
    
        if (!token) {
            console.log('Tentativa de acesso tem token! ')
            return res.status(403).send({message: 'Sem token para acesso.'})
        }

        jwt.verify(token, authSecret, function(err, decoded) {
            if (err) {
                console.log('ERRO NO jwt.verify ===> ', err)
                return res.status(403).send({
                    message: 'Falha ao autenticar token.'
                })
            } else {
                req.decoded = decoded
                const isAdministrator = decoded.isAdministrator
                if (!isAdministrator) {
                    return res.status(403).send({
                        message: 'Você não possui acesso a essa funcionalidade. Contate o Administrador do sistema.'
                    })
                } else {
                    next()
                }
            }
        })
    }
}