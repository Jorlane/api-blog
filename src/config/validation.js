const User = require('../models/user')
const errorLog = require('../service/error.log')

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

module.exports = { accessValidateUser }