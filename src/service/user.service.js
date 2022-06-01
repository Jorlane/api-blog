require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const https = require('https')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const validation = require('../config/validation')
const errorLog = require('./error.log')
const publicDir = require('../../consts')
const imagePublicDir = require('../../consts')
require('../../consts')

const authSecret = process.env.AUTH_SECRET

const emailRegex = /\S+@\S+\.\S+/
//const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/
function getUserProfile(user) {
    const userProfile = {}
    if (user) {
        userProfile.id = user.id
        userProfile.name = user.name
        userProfile.email = user.email
        userProfile.photo = user.photo
        userProfile.bioDescription = user.bioDescription
        userProfile.allowEmailNotification = user.allowEmailNotification
        userProfile.frequencyEmailNotification = user.frequencyEmailNotification
        userProfile.firstAccess = user.firstAccess
        userProfile.lastAccess = user.lastAccess
        userProfile.isAdministrator = user.isAdministrator
        userProfile.commentBlocked = user.commentBlocked
    }
    return userProfile
}

const getPublicProfile = (req, res, next) => {
    const userId = req.params.id
    User.findByPk(userId)
    .then(data => {
        if (data) {
            const user = data.toJSON()
            const userResponse = {
                id: user.id, 
                name: user.name, 
                bioDescription: user.bioDescription || '', 
                photo: user.photo
            }
            res.status(200).send(userResponse)
        } else {
            res.status(204).send(data)
        }
    })
    .catch(err => {
        const module = 'User'
        const method = 'getPublicProfile'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''

    User.findOne({
        where: {email}
    }).then(data => {
        if (data) {
            const user = data.toJSON()
            const dataToToken = {
                id: user.id, 
                name: user.name, 
                email: user.email,
                isAdministrator: user.isAdministrator
            }
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = jwt.sign(dataToToken, authSecret, {
                    expiresIn: "1 day"
                })
                const userProfile = getUserProfile(user)
                return res.status(200).send({ userProfile, token, valid: true})
            } else {
                return res.status(400).send({message: 'Usuário/Senha inválidos!'})
            }
        } else {
            return res.status(400).send({message: 'Usuário/Senha inválidos!'})
        }

    }).catch(err => {
        const module = 'User'
        const method = 'login'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

function downloadGoogleImageProfile(url) {
    return new Promise((resolve, reject) => {
        const fileName = 'google_image_profile-' + Date.now() + '.jpg' 
        let dataImage = null
        let imageDir = imagePublicDir

        axios({
            method: 'GET', 
            url: url, 
            responseType: 'stream'
        }).then(response => {
            response.data.pipe(fs.createWriteStream(path.join(imageDir, fileName)))
            resolve(fileName)
        })
    })
}

const loginWithGoogle = (req, res, next) => {
    const email = req.body.email || ''
    const name = req.body.name || ''
    const imageUrl = req.body.imageUrl || ''
    const tokenGoogle = req.body.tokenGoogle || ''

    // Atenção falta validar o token do google

    User.findOne({
        where: {email}
    }).then(data => {
        if (data) {
            const user = data.toJSON()
            const dataToToken = {
                id: user.id, 
                name: user.name, 
                email: user.email,
                isAdministrator: false
            }
            const token = jwt.sign(dataToToken, authSecret, {
                expiresIn: "1 day"
            })
            const userProfile = getUserProfile(user)
            return res.status(200).send({ userProfile, token, valid: true})
        } else {
            downloadGoogleImageProfile(imageUrl)
            .then(fileName => {
                const newUser = {
                    name, 
                    email, 
                    password: '', 
                    photo: fileName,
                    bioDescription: '', 
                    allowEmailNotification: false,
                    frequencyEmailNotification: '',
                    firstAccess: Date.now(), 
                    lastAccess:  Date.now(),
                    isAdministrator: false,
                    commentBlocked: false
                }
                User.create(newUser)
                .then(data => {
                    const user = data.toJSON()
                    const dataToToken = {
                        id: user.id, 
                        name: user.name, 
                        email: user.email,
                        isAdministrator: false
                    }
                    const token = jwt.sign(dataToToken, authSecret, {
                        expiresIn: "1 day"
                    })
                    const userProfile = getUserProfile(user)
                    return res.status(200).send({ userProfile, token, valid: true})
                })
                .catch(err => {
                    console.log('Dentro do catch do create: ', err)
                    const module = 'User'
                    const method = 'signup.create'
                    errorLog.log(module, method, err)
                    res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original ? err.original.sqlMessage : err}`})
                });
            })
            .catch((fileName, err) => {
                console.log('Dentro do catch de downloadImageGoogle. ')
                console.log('Dentro do catch de downloadImageGoogle fileName = ', fileName)
                console.log('Dentro do catch de downloadImageGoogle err = ', err)
            })
        }
    }).catch(err => {
        const module = 'User'
        const method = 'login'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

const getValidadeJwt = (req, callback) => {
    const token = req.body.token  || req.headers['authorization'] || ''
    jwt.verify(token, authSecret, callback)
}

const validateToken = (req, res, next) => {
    getValidadeJwt(req, (err, decoded) => {
        const {id, name, email, isAdministrator} = decoded
        User.findByPk(id)
            .then(user => {
                const userProfile = getUserProfile(user)
                return res.status(200).send({userProfile, valid: !err})
            })
            .catch(err => {
                const module = 'User'
                const method = 'validateToken.findByPk'
                errorLog.log(module, method, err)
                return res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            });
    })
}

const signup = (req, res, next) => {
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirmPassword || ''

    if (name.trim() === '') {
        return res.status(400).send({message: 'Por favor, informe um nome de usuário!', column: 'name'})
    }

    if (!email.match(emailRegex)) {
        return res.status(400).send({message: 'O email informado está inválido!', column: 'email'})
    } 

    if (password.trim() === '') {
        return res.status(400).send({message: 'A senha deve ser informada!', column: 'password'})
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ message: 'Confirmação de senha não confere.', column: 'password'})
    }

    User.findOne({
        where: {email}
    }).then(user => {
        if (user) {
            res.status(400).send({message: 'Usuário já cadastrado.', column: 'all'})
        } else {
            const newUser = {
                name, 
                email, 
                password: passwordHash, 
                photo: '',
                bioDescription: '', 
                allowEmailNotification: false,
                frequencyEmailNotification: '',
                firstAccess: Date.now(), 
                lastAccess:  Date.now(),
                isAdministrator: false,
                commentBlocked: false
            }
            User.create(newUser)
                .then(data => {
                    login(req, res, next)
                })
                .catch(err => {
                    const module = 'User'
                    const method = 'signup.create'
                    errorLog.log(module, method, err)
                    res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
                });
        }
    })
}

const updateProfile = (req, res, next) => {
    const userId = req.body.id

    validation.accessValidateUser(userId, req, res) 
        .then(data => {
            if (data) {
                const user = data
                user.name = req.body.name
                user.photo = req.body.photo
                user.bioDescription = req.body.bioDescription 
                user.allowEmailNotification = req.body.allowEmailNotification
                user.frequencyEmailNotification = req.body.frequencyEmailNotification
                user.save({fields: ['name', 'photo', 'bioDescription', 
                    'allowEmailNotification', 'frequencyEmailNotification']
                }).then(data => {
                    res.status(200).send({message: 'Alteração efetuada com sucesso!'})
                }).catch(err => {
                    const module = 'User'
                    const method = 'updateProfile.save'
                    errorLog.log(module, method, err)
                    res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
                });
            } else {
                res.status(204).send({message: 'Usuário não encontrado!'})
            }
        })
        .catch(err => {
            res.status(500).send({ message:  err.message })
        })
}

const getOwnProfile = (req, res, next) => {
    const userId = req.params.id
    validation.accessValidateUser(userId, req, res) 
        .then(user => {
            if (user) {
                userResponse = {
                    id: user.id, 
                    name: user.name, 
                    email: user.email,  
                    photo: user.photo, 
                    bioDescription: user.bioDescription, 
                    allowEmailNotification: user.allowEmailNotification, 
                    frequencyEmailNotification: user.frequencyEmailNotification, 
                    firstAccess: user.firstAccess, 
                    lastAccess: user.lastAccess
                }
                res.status(200).send(userResponse)
            } else {
                res.status(204).send({message: 'Usuário não encontrado!'})
            }
        }).catch(error => {
            res.status(500).send({message: 'Erro ao localizar usuário. msg: ' + error.message})
        })
}

const deleteOwnProfile = (req, res, next) => {
    const userId = req.params.id
    validation.accessValidateUser(userId, req, res) 
        .then(user => {
            if (user) {
                user.destroy()
                    .then(data => res.status(200).send({message: 'Perfil removido com sucesso!'}))
                    .catch(err => {
                        const module = 'User'
                        const method = 'deleteOwnProfile.destroy'
                        errorLog.log(module, method, err)
                        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
                    });
            } else {
                res.status(204).send({message: 'Usuário não encontrado!'})
            }
        }).catch(error => {
            res.status(500).send({message: 'Erro ao localizar usuário. msg: ' + error.message})
        })
}


const uploadImageProfile = function (req, res, next) {
    res.status(200).send({ filename: req.file.filename })
}

const createDefaultUserAdmin = function ()  {
    return new Promise((resolve, reject) => {

        const nameAdmin = 'admin'
        const emailAdmin = 'admin@adminblog.com'
        const passwordAdmin = 'admin'

        User.findOne({
            where: {email: emailAdmin}
        }).then(user => {
            if (user) { 
                resolve(user)
            } else {
                const salt = bcrypt.genSaltSync()
                const passwordHash = bcrypt.hashSync(passwordAdmin, salt)
                const newUser = {
                    name: nameAdmin, 
                    email: emailAdmin, 
                    password: passwordHash, 
                    photo: '',
                    bioDescription: '', 
                    allowEmailNotification: false,
                    frequencyEmailNotification: '',
                    firstAccess: Date.now(), 
                    lastAccess:  Date.now(),
                    isAdministrator: true,
                    commentBlocked: false
                }
                User.create(newUser)
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => {
                        const module = 'User'
                        const method = 'createDefaulUserAdmin.create'
                        errorLog.log(module, method, err)
                        reject({
                            status: 500, 
                            message: 'Erro ao criar usuário: ' + err.original.message
                        });
                    });
                }
            })
        }).catch(err => {
            const module = 'User'
            const method = 'createDefaulUserAdmin.findOne'
            errorLog.log(module, method, err)
            reject({
                status: 500, 
                message: 'Erro ao tentar buscar usuário: ' + err.message
            });
        })
}

const blockComment = (req, res, next) => {
    const userId = req.body.userId

    User.findByPk(userId) 
        .then(data => {
            if (data) {
                const user = data
                user.commentBlocked = true
                user.save({fields: ['commentBlocked']
                }).then(data => {
                    res.status(200).send({message: 'Alteração efetuada com sucesso!'})
                }).catch(err => {
                    const module = 'User'
                    const method = 'blockComment.save'
                    errorLog.log(module, method, err)
                    res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
                });
            } else {
                res.status(204).send({message: 'Usuário não encontrado!'})
            }
        })
        .catch(err => {
            res.status(500).send({ message:  err.message })
        })
}
const unblockComment = (req, res, next) => {
    const userId = req.body.userId

    User.findByPk(userId) 
        .then(data => {
            if (data) {
                const user = data
                user.commentBlocked = false
                user.save({fields: ['commentBlocked']
                }).then(data => {
                    res.status(200).send({message: 'Alteração efetuada com sucesso!'})
                }).catch(err => {
                    const module = 'User'
                    const method = 'unblockComment.save'
                    errorLog.log(module, method, err)
                    res.status(500).send({message: `Error in ${method} at ${module}:  ${err}`})
                });
            } else {
                res.status(204).send({message: 'Usuário não encontrado!'})
            }
        })
        .catch(err => {
            res.status(500).send({ message:  err.message })
        })
}

module.exports = { getPublicProfile, login, loginWithGoogle, validateToken, signup, updateProfile, getOwnProfile, deleteOwnProfile, uploadImageProfile, createDefaultUserAdmin, blockComment, unblockComment}