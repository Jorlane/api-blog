const request = require('supertest')
const app = require('../src/app');
const db = require('../src/db')

/* ********************************************************
  Regras: 
    Deve ser possível consultar todas as categorias
    Deve ser possível consultar uma categoria por id
    Deve ser possível incluir uma categoria
    O nome da categoria não pode ficar em branco
    Não pode ter nome de categoria repetido
    Deve ser possível incluir uma subcategoria
    Não pode ter nome de subcategoria repetido dentro da mesma categoria
    Não é permitido excluir categoria que tenha subcategoria vinculada
    Dever ser possível consultar todas as categorias
   ******************************************************** */ 

let insertedCategories = [] 
let userLogged1 = {}

beforeAll(async () => {
  console.log('*=*=*=*=*=*=*=*=*=*= Início beforeAll category.test')


  const response = await request(app)
  .post('/oapi/users/login')  
  .send({
      email: 'admin@adminblog.com',
      password: 'admin'
  })
  userLogged1 = response.body

  insertedCategories = []

  console.log('*=*=*=*=*=*=*=*=*=*= Fim beforeAll category.test')
})

test('Deve ser possível incluir uma categoria', async () => {
  const response = await request(app)
      .post('/api/categories')  
      .send({
        name: 'Testando'
      })
      .set({ 'authorization': userLogged1.token })
  insertedCategories.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('O nome da categoria não pode ficar em branco', async () => {
  const response = await request(app)
    .post('/api/categories')
    .send({ })
    .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(422)
})

test('Não pode ter nome de categoria repetido', async () => {
  const response = await request(app)
    .post('/api/categories')
    .send({
      name: 'Testando'
    })
    .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(422)
})

test('Incluindo uma segunda categoria', async () => {
  const response = await request(app)
    .post('/api/categories')
    .send({
      name: 'Testando 2'
    })
    .set({ 'authorization': userLogged1.token })
  insertedCategories.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve ser possível incluir uma subcategoria', async () => {
  const response = await request(app)
      .post('/api/categories')
      .send({
        name: 'Subcategoria de Testando', 
        categoryParent: insertedCategories[0].id
      })
      .set({ 'authorization': userLogged1.token })
  insertedCategories.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Deve permitir incluir subcategoria com mesmo nome em categorias diferentes', async () => {
  const response = await request(app)
      .post('/api/categories')
      .send({
        name: 'Subcategoria de Testando', 
        categoryParent: insertedCategories[1].id
      })
      .set({ 'authorization': userLogged1.token })
  insertedCategories.push(response.body)
  expect(response.statusCode).toBe(201)
})

test('Não pode ter nome de subcategoria repetido dentro da mesma categoria', async () => {
  const response = await request(app)
      .post('/api/categories')
      .send({
        name: 'Subcategoria de Testando', 
        categoryParent: insertedCategories[1].id
      })
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(422)
})  

test('Não é permitido excluir categoria que tenha subcategoria vinculada', async() => {
  const response = await request(app)
    .delete('/api/categories/' + insertedCategories[0].id)
    .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(422)
})

test('Deve ser possível consultar todas as categorias', async () => {
  const response = await request(app)
    .get('/oapi/categories')
    
  expect(response.body.length).toBeGreaterThanOrEqual(insertedCategories.length)
})