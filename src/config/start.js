const User = require('../service/user.service')
const Section = require('../service/section.service')

exports.initDataBase = async () => {       
    await User.createDefaultUserAdmin()

    Section.findByPk('CAPTION')
        .then(data => {
            if (data.status === 204) {
                Section.create('CAPTION')
                    .then(data => console.log('Inclusão de seção: ' , data.data.name))
                    .catch(err => console.log('Erro na inclusão de seção:', err.original.sqlMessage))
                Section.create('PARAGRAPH')
                    .then(data => console.log('Inclusão de seção: ' , data.data.name))
                    .catch(err => console.log('Erro na inclusão de seção:', err.original.sqlMessageerr))
                Section.create('IMAGE')
                    .then(data => console.log('Inclusão de seção: ' , data.data.name))
                    .catch(err => console.log('Erro na inclusão de seção:', err.original.sqlMessage))
                Section.create('QUOTE')
                    .then(data => console.log('Inclusão de seção: ' , data.data.name))
                    .catch(err => console.log('Erro na inclusão de seção:', err.original.sqlMessage))
                Section.create('LIST')
                    .then(data => console.log('Inclusão de seção: ' , data.data.name))
                    .catch(err => console.log('Erro na inclusão de seção:', err.original.sqlMessage))
                Section.create('CODE')
                    .then(data => console.log('Inclusão de seção: ' , data.data.name))
                    .catch(err => console.log('Erro na inclusão de seção:', err.original.sqlMessage))
            }
        })
        .catch(err => {
            console.log('Erro ao localizar section: ', err.original.sqlMessage)
        })
}