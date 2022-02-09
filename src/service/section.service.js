require('dotenv').config()

const Section = require('../models/section')

exports.create = (name) => {
    return new Promise((resolve, reject) => {
        const newSection = {id: name, name: name}
        Section.create(newSection)
            .then(data => {
                resolve({status: 200, data: data.dataValues});
            })
            .catch(err => {
                reject({status: 500, err: err});
            });
    })
}

exports.findByPk = (sectionId) => {
    return new Promise((resolve, reject) => {
        Section.findByPk(sectionId)
            .then(data => {
                if (!data) {
                    resolve({status: 204, data})
                } else {
                    resolve({status: 200, data: data.dataValues})
                }
            })
            .catch(err => {
                reject({status: 500, err: err})
            })
    })
}