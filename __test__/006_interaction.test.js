const request = require('supertest')
const app = require('../src/app');
const db = require('../src/db')

/* ********************************************************
  Regras: 
    Deve ser possível registrar uma leitura de artigo
    Ao tentar registrar leitura de novo para o mesmo artigo, não deve incluir mas sim retornar a que tem
    Deve ser permitido registrar o like em um artigo 
    Deve ser permitido remover o like de um artigo 
   ******************************************************** */ 

let insertedInteractions = [] 
let userLogged1 = {}
let articleInserted = {}
let categoryInserted = {}

beforeAll(async () => {
  console.log('*=*=*=*=*=*=*=*=*=*= Início beforeAll comment.test')

  let response = await request(app)
  .post('/oapi/users/login')  
  .send({
      email: 'admin@adminblog.com',
      password: 'admin'
  })
  userLogged1 = response.body

  console.log('User logged ==> ', userLogged1)

  response = await request(app)
      .post('/api/categories')  
      .send({
        name: 'Para testar interações com artigo'
      })
      .set({ 'authorization': userLogged1.token })
  categoryInserted = response.body

  response = await request(app)
  .post('/api/articles')  
  .send({
      writerId: userLogged1.userProfile.id,
      title: 'Artigo incluído no teste de interações',
      categoryId: categoryInserted.id,
      htmlFilePath: '',
      route: ''
  })
  .set({ 'authorization': userLogged1.token })

  articleInserted = response.body

  insertedInteractions = []

  console.log('*=*=*=*=*=*=*=*=*=*= Fim beforeAll comment.test')
})

test('Deve ser possível registrar uma leitura de artigo', async () => {
  const response = await request(app)
      .post('/api/interactions/registerReading/')  
      .send({
        userId: userLogged1.userProfile.id, 
        articleId: articleInserted.id
      })
      .set({ 'authorization': userLogged1.token })
  insertedInteractions.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Ao tentar registrar leitura de novo para o mesmo artigo, não deve incluir mas sim retornar a que tem.', async () => {
  const response = await request(app)
      .post('/api/interactions/registerReading/')  
      .send({
        userId: userLogged1.userProfile.id, 
        articleId: articleInserted.id
      })
      .set({ 'authorization': userLogged1.token })
  insertedInteractions.push(response.body)
  expect(response.statusCode).toBe(200)
})

test('Deve ser permitido registrar o like em um artigo', async () => {
  const response = await request(app)
      .post('/api/interactions/putLike/')  
      .send({
        userId: userLogged1.userProfile.id, 
        articleId: articleInserted.id
      })
      .set({ 'authorization': userLogged1.token })
  insertedInteractions.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve ser permitido remover o like de um artigo', async () => {
  const response = await request(app)
      .post('/api/interactions/removeLike/')  
      .send({
        userId: userLogged1.userProfile.id, 
        articleId: articleInserted.id
      })
      .set({ 'authorization': userLogged1.token })
  insertedInteractions.push(response.body)
  expect(response.statusCode).toBe(201)
})