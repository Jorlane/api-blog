const request = require('supertest')
const app = require('../src/app');
const db = require('../src/db')

/* ********************************************************
  Regras: 
    Deve ser possível criar uma conexão 
    Deve ser possível o escritor ser seguido por mais de um usuário 
    Deve ser possível o mesmo usuário seguir mais de um escritor
    Dever ser possível consultar  conexão
    Deve ser possível excluir uma conexão
   ******************************************************** */ 

let firstUser
let secondUser
let writerUser
let writer
let writerUser2
let writer2
let insertedConnections = []

beforeAll(async () => {
  console.log('*=*=*=*=*=*=*=*=*=*= Início beforeAll complaint.test')

  let response = await request(app)
    .post('/oapi/users/signup')  
    .send({
      name: 'First User Test Connection',
      email: 'firstUserConnection@teste.com.br',
      password: '123', 
      confirmPassword: '123'
    })
  firstUser = response.body

  response = await request(app)
    .post('/oapi/users/signup')  
    .send({
      name: 'Second User Test Connection',
      email: 'secondUserConnection@teste.com.br',
      password: '123', 
      confirmPassword: '123'
    })
  secondUser = response.body

  // Cadastrando primeiro escritor
  response = await request(app)
    .post('/oapi/users/signup')  
    .send({
      name: 'Writer Test Connection',
      email: 'writerUserConnection@teste.com.br',
      password: '123', 
      confirmPassword: '123'
    })
  writerUser = response.body

  response = await request(app)
    .post('/api/writers')  
    .send({
    userId: writerUser.userProfile.id,
    imageBanner: null, 
    headerColorText: '#000', 
    headerColorBackground: '#eee', 
    articleColorText: '#000', 
    articleColorBackground: '#eee', 
    allowComments: true
    })
        .set({ 'authorization': writerUser.token })
  writer = response.body
  
  // Cadastrando segundo escritor
  response = await request(app)
    .post('/oapi/users/signup')  
    .send({
      name: 'Writer 2 Test Connection',
      email: 'writer2UserConnection@teste.com.br',
      password: '123', 
      confirmPassword: '123'
    })
  writerUser2 = response.body

  response = await request(app)
    .post('/api/writers')  
    .send({
    userId: writerUser2.userProfile.id,
    imageBanner: null, 
    headerColorText: '#000', 
    headerColorBackground: '#eee', 
    articleColorText: '#000', 
    articleColorBackground: '#eee', 
    allowComments: true
    })
    .set({ 'authorization': writerUser2.token })
  writer2 = response.body

  console.log('*=*=*=*=*=*=*=*=*=*= Fim beforeAll complaint.test')
})

test('Deve ser possível criar uma conexão ', async () => {
  const response = await request(app)
      .post('/api/connections/')  
      .send({
        userId: firstUser.userProfile.id,
        writerId: writer.userId
      })
      .set({ 'authorization': firstUser.token })
  insertedConnections.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve ser possível o escritor ser seguido por mais de um usuário ', async () => {
  const response = await request(app)
      .post('/api/connections/')  
      .send({
        userId: secondUser.userProfile.id,
        writerId: writer.userId
      })
      .set({ 'authorization': secondUser.token })
  insertedConnections.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve ser possível o mesmo usuário seguir mais de um escritor', async () => {
  const response = await request(app)
      .post('/api/connections/')  
      .send({
        userId: secondUser.userProfile.id,
        writerId: writer2.userId
      })
      .set({ 'authorization': secondUser.token })
  insertedConnections.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve ser possível consultar uma conexão', async () => {
  const response = await request(app)
      .get('/api/connections/' + writer2.userId)  
      .set({ 'authorization': secondUser.token })
  
  expect(response.statusCode).toBe(200)
})

test('Deve ser possível excluir uma conexão', async () => {
  const response = await request(app)
      .delete('/api/connections/' + writer2.userId)  
      .set({ 'authorization': secondUser.token })
  insertedConnections.push(response.body)
  expect(response.statusCode).toBe(200)
})
