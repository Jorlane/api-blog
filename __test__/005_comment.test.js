const request = require('supertest')
const app = require('../src/app');
const db = require('../src/db')

/* ********************************************************
  Regras: 
    Deve ser possível criar um comentário para um artigo
    O comentário deve estar associado a um artigo 
    O comentário deve estar associado a um usuário
    O comentário deve possuir um texto
    O texto do comentário não pode ser em branco
    Deve ser possível consultar os comentários válidos de um artigo e não precisar estar logado
    Deve ser possível excluir um comentário pelo id
    Deve ser possível excluir os comentários de um artigo
    Deve ser possível alterar um comentário
   ******************************************************** */ 

let insertedComments = [] 
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
        name: 'Para testar comentários'
      })
      .set({ 'authorization': userLogged1.token })
  categoryInserted = response.body

  response = await request(app)
  .post('/api/articles')  
  .send({
      writerId: userLogged1.userProfile.id,
      title: 'Artigo incluído no teste de comentários',
      categoryId: categoryInserted.id,
      htmlFilePath: '',
      route: ''
  })
  .set({ 'authorization': userLogged1.token })

  articleInserted = response.body

  console.log('primeiro artigo ==> ', articleInserted)

  insertedComments = []

  console.log('*=*=*=*=*=*=*=*=*=*= Fim beforeAll comment.test')
})

test('Deve ser possível criar um comentário para um artigo', async () => {
  const response = await request(app)
      .post('/api/comments')  
      .send({
        text: 'Testando inclusão de comentário', 
        articleId: articleInserted.id,
        userId: userLogged1.userProfile.id
      })
      .set({ 'authorization': userLogged1.token })
  insertedComments.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('O comentário deve estar associado a um artigo', async() => {
  const response = await request(app)
      .post('/api/comments')  
      .send({
        text: 'Testando inclusão de comentário sem artigo', 
        userId: userLogged1.userProfile.id
      })
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(422)
})

test('O comentário deve estar associado a um usuário', async() => {
  const response = await request(app)
      .post('/api/comments')  
      .send({
        text: 'Testando inclusão de comentário sem usuário', 
        articleId: articleInserted.id
      })
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(422)
})

test('O comentário deve possuir um texto', async() => {
  const response = await request(app)
      .post('/api/comments')  
      .send({
        articleId: articleInserted.id,
        userId: userLogged1.userProfile.id
      })
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(422)
})

test('O texto do comentário não pode ser em branco', async() => {
  const response = await request(app)
      .post('/api/comments')  
      .send({
        text: ' ',
        articleId: articleInserted.id,
        userId: userLogged1.userProfile.id
      })
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(422)
})  

test('Incluindo um segundo comentário válido!', async () => {
  const response = await request(app)
      .post('/api/comments')  
      .send({
        text: 'Incluindo um segundo comentário válido', 
        articleId: articleInserted.id,
        userId: userLogged1.userProfile.id
      })
      .set({ 'authorization': userLogged1.token })
  insertedComments.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve ser possível consultar os comentários válidos de um artigo e não precisa estar logado', async() => {
  const response = await request(app)
    .get('/oapi/comments/' + articleInserted.id)

  console.log('response.body ===> ', response.body)

  expect(response.statusCode).toBe(200)
  expect(response.body.length).toBe(insertedComments.length)
})

test('Deve ser possível excluir um comentário pelo Id', async() => {
  const response = await request(app)
  .delete('/api/comments/' + insertedComments[0].id)  
  .set({ 'authorization': userLogged1.token })
expect(response.statusCode).toBe(200)
})

test('Deve ser possível excluir os comentários de um artigo', async() => {
  const response = await request(app)
  .delete('/api/comments/deleteByArticle/' + insertedComments[0].articleId)  
  .set({ 'authorization': userLogged1.token })
expect(response.statusCode).toBe(200)
})

test('Incluindo um comentário para depois alterar.', async () => {
  const response = await request(app)
      .post('/api/comments')  
      .send({
        text: 'Incluindo um comentário para depois alterar', 
        articleId: articleInserted.id,
        userId: userLogged1.userProfile.id
      })
      .set({ 'authorization': userLogged1.token })
  insertedComments.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve ser possível alterar um comentário', async() => {
  const response = await request(app)
  .put('/api/comments/' + 3) // insertedComments[insertedComments.length - 1].id)  
  .send({
    text: 'Status alterado para EXCLUIDO', 
    status: 'EXCLUIDO'
  })
  .set({ 'authorization': userLogged1.token })
expect(response.statusCode).toBe(200)
})
