const request = require('supertest')
const app = require('../src/app');
const db = require('../src/db')

/* ********************************************************
  Regras: 
    Deve ser possível incluir registro de escritor (obrigatório login)
    Deve ser possível obter um registro de escritor (não precisa estar logado)
    Deve ser possível obter todos os escritores (não precisa estar logado)
    Deve ser possível excluir um registro de escritor (obrigatório login)
   ******************************************************** */ 

let userLogged1 = {}
let insertedWriters = []

beforeAll(async () => {
    console.log('*=*=*=*=*=*=*=*=*=*= Início beforeAll writer.test')

    const response = await request(app)
      .post('/oapi/users/signup')  
      .send({
        name: 'UserToTestWriter',
        email: 'UserToTestWriter@teste.com.br',
        password: '123', 
        confirmPassword: '123'
      })
    userLogged1 = response.body
    insertedWriters = []
    console.log('*=*=*=*=*=*=*=*=*=*= Fim beforeAll writer.test')
})
  
test('Deve ser possível incluir registro de escritor (obrigatório login)', async () => {
    const response = await request(app)
        .post('/api/writers')  
        .send({
        userId: userLogged1.userProfile.id,
        imageBanner: null, 
        headerColorText: '#000', 
        headerColorBackground: '#eee', 
        articleColorText: '#000', 
        articleColorBackground: '#eee', 
        allowComments: true
        })
        .set({ 'authorization': userLogged1.token })

    insertedWriters.push(response.body)
    expect(response.statusCode).toBe(200)
})

test('Deve ser possível obter um registro de escritor (não precisa estar logado)', async () => {
    const response = await request(app)
      .get('/oapi/writers/' + insertedWriters[0].userId) 
  expect(response.statusCode).toBe(200)
})

test('Deve ser possível obter todos os escritores (não precisa estar logado)', async () => {
  const response = await request(app)
      .get('/oapi/writers/') 
  expect(response.statusCode).toBe(200)
})

test('Deve ser possível excluir um registro de escritor (obrigatório login)', async () => {
    const response = await request(app)
        .delete('/api/writers/' + insertedWriters[0].userId) 
        .set({ 'authorization': userLogged1.token })
    expect(response.statusCode).toBe(200)
})


  