const request = require('supertest')
const app = require('../src/app');
const db = require('../src/db')

/* ********************************************************
  Regras: 
    Deve ser possível incluir um usuário (Signup)
    Deve proibir cadastrar usuário repetido (email)
    Deve proibir login com senha inválida
    Deve permitir login com senha válida
    O email informado no signup deve ser um email válido
    Deve ser possível alterar o próprio perfil
    Deve ser possível consultar dados do próprio perfil
    Deve ser possível excluir o próprio perfil
   ******************************************************** */ 

let userLogged1, userLogged2

beforeAll(async () => {
  console.log('*=*=*=*=*=*=*=*=*=*= Início beforeAll user.test')
  // await db.sync({ force : true })
  // User.createDefaultUserAdmin()
  userLogged1 = {
    id: null, 
    token: null, 
    tokenValid: false
  }
  userLogged2 = {
    id: null, 
    token: null, 
    tokenValid: false
  }
  console.log('*=*=*=*=*=*=*=*=*=*= Fim beforeAll user.test')
})
  

test('Deve ser possível incluir um usuário (Signup)', async () => {
  const response = await request(app)
      .post('/oapi/users/signup')  
      .send({
        name: 'New User Test',
        email: 'newuser@teste.com.br',
        password: '123', 
        confirmPassword: '123'
      })
  // After including a user, the login is automatic, for this the return code must be 200
  expect(response.statusCode).toBe(200)
  expect(response.body.valid).toBe(true)
})

test('Deve proibir cadastrar usuário repetido (email)', async () => {
  const response = await request(app)
      .post('/oapi/users/signup')  
      .send({
        name: 'Usuário repetido',
        email: 'newuser@teste.com.br',
        password: '123', 
        confirmPassword: '123'
      })
  expect(response.statusCode).toBe(400)
})

test('Deve proibir login com senha inválida', async () => {
  const response = await request(app)
      .post('/oapi/users/login')  
      .send({
        email: 'newuser@teste.com.br',
        password: '124'
      })
  expect(response.statusCode).toBe(400)
})

test('Deve permitir login com senha válida', async () => {
  const response = await request(app)
      .post('/oapi/users/login')  
      .send({
        email: 'newuser@teste.com.br',
        password: '123'
      })
  userLogged1 = response.body
  expect(response.statusCode).toBe(200)
})

test('O email informado no signup deve ser um email válido', async () => {
  const response = await request(app)
      .post('/oapi/users/signup')  
      .send({
        email: 'newuserteste.com.br',
        password: '123'
      })
  expect(response.statusCode).toBe(400)
})

test('Deve ser possível alterar o perfil de um usuário. Usuário deve estar logado com token válido.', async () => { 
  const response = await request(app)
      .put('/api/users')  
      .send({
        id: userLogged1.userProfile.id,
        name: 'Nome de usuário alterado no teste',
        photo: null, 
        bioDescription: 'bio alterada para verificar teste', 
        allowEmailNotification: true,
        frequencyEmailNotification: 'MENSAL'
      })
      .set({ 'authorization': userLogged1.token })

  expect(response.statusCode).toBe(200)
})

test('Deve ser possível incluir mais de um usuário', async () => {
  const response = await request(app)
      .post('/oapi/users/signup')  
      .send({
        name: 'Segundo usuário incluído no teste',
        email: 'Segundo@teste.com.br',
        password: '999', 
        confirmPassword: '999'
      })
  userLogged2 = response.body
  // After including a user, the login is automatic, for this the return code must be 200
  expect(response.statusCode).toBe(200)
  expect(response.body.valid).toBe(true)
})

test('Deve proibir alterar o perfil de outro usuário.', async () => {
  const response = await request(app)
      .put('/api/users')  
      .send({
        id: userLogged2.userProfile.id,
        name: 'Tentando alterar o nome de outro usuário',
        photo: null, 
        bioDescription: 'não dever permitir alterar perfil de outro usuário', 
        allowEmailNotification: true,
        frequencyEmailNotification: 'MENSAL'
      })
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(403)
})

test('Deve ser possível consultar dados do próprio perfil', async () => {
  const response = await request(app)
      .get('/api/users/' + userLogged1.userProfile.id) 
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(200)
})

test('Não permitir obter dados de outro usuário', async () => {
  const response = await request(app)
      .get('/api/users/' + userLogged2.userProfile.id) 
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(403)
})

test('Deve ser possível excluir o próprio perfil', async () => {
  const response = await request(app)
      .delete('/api/users/' + userLogged2.userProfile.id) 
      .set({ 'authorization': userLogged2.token })
  expect(response.statusCode).toBe(200)
})

test('Não permitir excluir perfil de outro usuário', async () => {
  const response = await request(app)
      .delete('/api/users/' + userLogged1.userProfile.id) 
      .set({ 'authorization': userLogged2.token })
  expect(response.statusCode).toBe(403)
})
