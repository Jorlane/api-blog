const request = require('supertest')
const db = require('../src/db')
const User = require('../src/service/user.service')
const Category = require('../src/service/category.service')
const Writer = require('../src/service/Writer.service')
const Article = require('../src/service/Article.service')
const SectionInArticle = require('../src/service/SectionInArticle.service')
const start = require('../src/config/start')

const associations = require('../src/models/associations')

const init_test = async() =>  {
    console.log('*=*=*=*=*=*=*=*=*=*= Início da configuração do test.')
    await db.sync({ force : true })
    await start.initDataBase()
    console.log('*=*=*=*=*=*=*=*=*=*= Fim da configuração do test.')
}

init_test()