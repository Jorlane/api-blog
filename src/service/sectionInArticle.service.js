require('dotenv').config()

const { Console } = require('console')
const fs = require('fs')
const Section = require('../models/section')

const SectionInArticle = require('../models/sectionInArticle')
const errorLog = require('./error.log')

exports.create = (req, res, next) => {
    const newSectionInArticle = {
        articleId: req.body.articleId,
        sectionId: req.body.sectionId, 
        text: req.body.text || '',
        imagePath: req.body.imagePath || '', 
        complement: req.body.complement || '', 
        sequence: req.body.sequence || 0
    }
    SectionInArticle.create(newSectionInArticle)
        .then(data => {
            res.status(201).send(data)
        })
        .catch(err => {
            const module = 'SectionInArticle'
            const method = 'create'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
}

exports.update = (req, res, next) => {
    const id = req.body.id
        
    SectionInArticle.findByPk(id)
        .then(data => {
            if (data) {
                const sectionInArticle = data
                sectionInArticle.text = req.body.text
                sectionInArticle.imagePath = req.body.imagePath
                sectionInArticle.complement = req.body.complement
                sectionInArticle.sequence = req.body.sequence || 0
                sectionInArticle.save({fields: ['text', 'imagePath', 'complement', 'sequence']
                    }).then(data => {
                        res.status(200).send({message: 'Alteração efetuada com sucesso!'})
                    }).catch(err => {
                        const module = 'SectionInArticle'
                        const method = 'update.save'
                        errorLog.log(module, method, err)
                        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
                    });
            }
        })
        .catch(err => {
            const module = 'SectionInArticle'
            const method = 'update.findByPk'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
}

exports.delete = (req, res, next) => {
    SectionInArticle.findByPk(req.params.id)
    .then(data => {
        if (data) {
            if (data.sectionId === 'IMAGE') {
                const fileName = data.imagePath
                const filePath = 'public/images/article/' + fileName
                fs.rm(filePath, {recursive: true})
            }

            SectionInArticle.destroy({
                where: {id: req.params.id}
            })
            .then((count) => {
                if (count >= 1) {
                    res.status(200).send({message: 'Registro excluído com sucesso!'})
                } 
            })
            .catch(err => {
                const module = 'SectionInArticle'
                const method = 'delete.destroy'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            });
        }
    })
    .catch(err => {
        const module = 'SectionInArticle'
        const method = 'delete.findByPk'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });

    
}

exports.deleteImageFiles = (req, res, next) => {
    const imageFiles = req.body
    let count = 0
    try {
        for (let i = 0; i < imageFiles.length; i++) {
            const fileName = imageFiles[i]
            const filePath = 'public/images/article/' + fileName
            fs.rm(filePath, {recursive: true}, () => {
                console.log('Info: arquivo excluído => ', filePath)
                count++
            })
        }
    } catch(err) {
        const module = 'SectionInArticle'
        const method = 'deleteImageFiles'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}`})
    }
    
    res.status(200).send(`Foram excluídos ${count} arquivos.`)
}

exports.deleteAllSectionByArticleId = (req, res, next) => {
    SectionInArticle.findAll({
        where: {
            articleId: req.params.articleId
        }
    })
    .then(data => {
        // for (let i = 0; i < data.length; i++) {
        //     if (data[i].dataValues.sectionId === 'IMAGE') {
        //         const fileName = data[i].dataValues.imagePath
        //         const filePath = 'public/images/article/' + fileName
        //         fs.rm(filePath, {recursive: true}, () => {
        //             console.log('Info: arquivo excluído => ', filePath)
        //         })
        //     }
        // }
        SectionInArticle.destroy({
            where: {articleId: req.params.articleId}
        })
        .then((count) => {
            if (count >= 1) {
                res.status(200).send({message: 'Registro(s) excluído(s) com sucesso!'})
            } else {
                res.status(200).send({message: 'Sem registros para excluir!'})
            }
        })
        .catch(err => {
            const module = 'SectionInArticle'
            const method = 'deleteAllSectionByArticleId'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
    })
    .catch(err => {
        const module = 'SectionInArticle'
        const method = 'deleteAllSectionByArticleId.findAll'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });

}

exports.uploadImage = function (req, res, next) {
    console.log('Dentro de uploadImage. req ===> ', req.file)
    res.status(200).send({ filename: req.file.filename })
}
