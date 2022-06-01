const request = require('supertest')
const app = require('../src/app');
const db = require('../src/db')

/* ********************************************************
  Regras: 
    Deve ser possível criar uma denúncia para um comentário
    O motivo da denúncia é obrigatório
    Deve ser possível criar mais de uma denúncia para um mesmo comentário
    Deve ser possível consultar as denúncias pendentes
    Deve ser possível alterar o status da denúncia para deferida
    Deve ser possível alterar o status da denúncia para indeferida
   ******************************************************** */ 

let insertedComplaints = [] 
let userLogged1 = {}
let articleInserted = {}
let commentInserted = {}
let categoryInserted = {}

beforeAll(async () => {
  console.log('*=*=*=*=*=*=*=*=*=*= Início beforeAll complaint.test')

  let response = await request(app)
  .post('/oapi/users/login')  
  .send({
      email: 'admin@adminblog.com',
      password: 'admin'
  })
  userLogged1 = response.body

  response = await request(app)
      .post('/api/categories')  
      .send({
        name: 'Para testar denúncias'
      })
      .set({ 'authorization': userLogged1.token })
  categoryInserted = response.body

  response = await request(app)
  .post('/api/articles')  
  .send({
      writerId: userLogged1.userProfile.id,
      title: 'Artigo incluído no teste de denúncias de comentários',
      categoryId: categoryInserted.id,
      htmlFilePath: '',
      route: ''
  })
  .set({ 'authorization': userLogged1.token })

  articleInserted = response.body

  response = await request(app)
      .post('/api/comments')  
      .send({
        text: 'Comentário para testar denúncias', 
        articleId: articleInserted.id,
        userId: userLogged1.userProfile.id
      })
      .set({ 'authorization': userLogged1.token })
  
  commentInserted = response.body

  insertedComplaints = []

  console.log('*=*=*=*=*=*=*=*=*=*= Fim beforeAll complaint.test')
})

test('Deve ser possível criar uma denúncia para um comentário', async () => {
  const response = await request(app)
      .post('/oapi/complaints')  
      .send({
        reason: 'Testando inclusão de denúncia', 
        commentId: commentInserted.id 
      })
  insertedComplaints.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('O motivo da denúncia é obrigatório', async () => {
  const response = await request(app)
      .post('/oapi/complaints')  
      .send({
        commentId: commentInserted.id
      })
  expect(response.statusCode).toBe(422)
})

test('Deve ser possível criar mais de uma denúncia para um mesmo comentário', async () => {
  const response = await request(app)
      .post('/oapi/complaints')  
      .send({
        reason: 'Segunda denúncia do comentário', 
        commentId: commentInserted.id 
      })
  insertedComplaints.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve ser possível consultar as denúncias pendentes', async() => {
  const response = await request(app)
    .get('/api/complaints/pending/')
    .set({ 'authorization': userLogged1.token })

  expect(response.statusCode).toBe(200)
  expect(response.body.length).toBe(insertedComplaints.length)
})

test('Para consultar as denúncias é obrigatório estar logado como Admin', async() => {
  const response = await request(app)
    .get('/api/complaints/pending/')

  expect(response.statusCode).toBe(403)
})

test('Deve ser possível alterar o status da denúncia para deferida', async () => {
  const response = await request(app)
      .put('/api/complaints/' + insertedComplaints[0].id)  
      .send({
        status: 'DEFERIDA'
      })
      .set({ 'authorization': userLogged1.token })
  insertedComplaints.push(response.body)
  expect(response.statusCode).toBe(200)
})

test('Deve ser possível alterar o status da denúncia para indeferida', async () => {
  const response = await request(app)
      .put('/api/complaints/' + insertedComplaints[1].id)  
      .send({
        status: 'INDEFERIDA'
      })
      .set({ 'authorization': userLogged1.token })
  insertedComplaints.push(response.body)
  expect(response.statusCode).toBe(200)
})

