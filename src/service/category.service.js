const Category = require('../models/category')
const errorLog = require('./error.log')

exports.create = (req, res) => {
    const category = req.body
    if (!category.name) {
      res.status(422).send({
        message: "O Nome da categoria é obrigatório!"
      });
      return;
    }

    if (category.categoryParent === undefined) {
        category.categoryParent = null
    }
    Category.findAll({
        where: {
            name: category.name, 
            categoryParent: category.categoryParent
            }
    }).then(data => {
        if (data.length > 0) {
            res.status(422).send({
                message: "Já existe categoria com esse nome."
            })
            return
        } else {
            category.initDate = Date.now()
            category.initDate = category.initDate - (category.initDate % 1000)
            Category.create(category)
            .then(data => {
                res.status(201).send(data);
            })
            .catch(err => {
                const module = 'Category'
                const method = 'create'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            });
        }
    })
}

exports.findAll = (req, res) => {
    Category.findAll(
        {
            order: [
                ['initDate', 'DESC']
            ],
        }
    )
    .then(data => {
        res.status(200).send(data)
    })
    .catch(err => {
        const module = 'Category'
        const method = 'findAll'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });
}

exports.findById = (req, res) => {
    Category.findByPk(req.params.id)
        .then(data => {
            res.status(200).send(data)
        })
        .catch(err => {
            const module = 'Category'
            const method = 'findById'
            errorLog.log(module, method, err)
            res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
        });
}

exports.delete = (req, res) => {
    const id = req.params.id
    Category.findOne({
        where: {categoryParent: id}
    }).then(data => {
        if (data) {
            const message = 'Exclusão de categoria não permitida por conter subcategoria(s).'
            res.status(422).send({message})
        } else {
            Category.destroy({
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
                const module = 'Category'
                const method = 'delete.destroy'
                errorLog.log(module, method, err)
                res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
            });
        }
    }).catch(err => {
        const module = 'Category'
        const method = 'delete.findOne'
        errorLog.log(module, method, err)
        res.status(500).send({message: `Error in ${method} at ${module}:  ${err.original.sqlMessage}`})
    });

    
}