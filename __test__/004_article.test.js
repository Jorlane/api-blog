const request = require('supertest')
const app = require('../src/app');
const db = require('../src/db')

/* ********************************************************
  Regras: 
    Deve ser possível incluir registro de escritor (obrigatório login)
    Deve ser possível obter um artigo (não precisa estar logado)
    Deve ser possível obter todos os artigos (não precisa estar logado)
    Permitir exclusão somente de artigo do próprio usuário
    Deve ser possível excluir um artigo (obrigatório login)
    Permitir inclusão de artigo somente do próprio usuário
   ******************************************************** */ 

let userLogged1, userLogged2 = {}
let insertedArticles = []
let insertedSectionsArticles = []
let categories = []

beforeAll(async () => {
    console.log('*=*=*=*=*=*=*=*=*=*= Início beforeAll Article.test')

    const responseCategory = await request(app)
      .get('/oapi/categories')
    categories = responseCategory.body
    if (categories.length <= 0) {
      const responseAdmin = await request(app)
        .post('/oapi/users/login')  
        .send({
            email: 'admin@adminblog.com',
            password: 'admin'
        })
      const admin = responseAdmin.body
      const respCatInserted = await request(app)
        .post('/api/categories')  
        .send({
          name: 'Teste para Artigo'
        })
        .set({ 'authorization': admin.token })

      categories.push(respCatInserted.body)
    }

    const response = await request(app)
      .post('/oapi/users/signup')  
      .send({
        name: 'UserToTestArticle',
        email: 'UserToTestArticle@teste.com.br',
        password: '456', 
        confirmPassword: '456'
      })
    userLogged1 = response.body

    const response2 = await request(app)
      .post('/oapi/users/signup')  
      .send({
        name: 'User2ToTestArticle',
        email: 'User2ToTestArticle@teste.com.br',
        password: '222', 
        confirmPassword: '222'
      })
    userLogged2 = response2.body
  
    insertedArticles = []
    insertedSectionsArticles = []
    console.log('*=*=*=*=*=*=*=*=*=*= Fim beforeAll Article.test')
})
  
test('Deve ser possível incluir artigo (obrigatório login)', async () => {
    console.log('****** userLogged1 ===> ', userLogged1)
    const response = await request(app)
        .post('/api/articles')  
        .send({
            writerId: userLogged1.userProfile.id,
            title: 'Artigo incluído no teste',
            categoryId: 1,
            htmlFilePath: '',
            route: ''
        })
        .set({ 'authorization': userLogged1.token })

    insertedArticles.push(response.body)
    expect(response.statusCode).toBe(200)
})

test('Deve ser possível incluir um segundo artigo (obrigatório login)', async () => {
    console.log('****** userLogged1 ===> ', userLogged1)
    const response = await request(app)
        .post('/api/articles')  
        .send({
            writerId: userLogged1.userProfile.id,
            title: 'Segundo artigo incluído no teste',
            categoryId: 1,
            htmlFilePath: '',
            route: ''
        })
        .set({ 'authorization': userLogged1.token })

    insertedArticles.push(response.body)
    expect(response.statusCode).toBe(200)
})

test('Deve ser possível obter um artigo (não precisa estar logado)', async () => {
    const response = await request(app)
      .get('/oapi/articles/' + insertedArticles[0].id) 
    expect(response.statusCode).toBe(200)
})

test('Deve ser possível obter todos os artigos (não precisa estar logado)', async () => {
  const response = await request(app)
      .get('/oapi/articles/') 
  expect(response.statusCode).toBe(200)
})

test('Permitir exclusão somente de artigo do próprio usuário', async () => {
    const response = await request(app)
        .delete('/api/articles/' + insertedArticles[0].id) 
        .set({ 'authorization': userLogged2.token })
    expect(response.statusCode).toBe(403)
})

test('Deve ser possível excluir um artigo (obrigatório login)', async () => {
  const response = await request(app)
      .delete('/api/articles/' + insertedArticles[1].id) 
      .set({ 'authorization': userLogged1.token })
  expect(response.statusCode).toBe(200)
})

test('Permitir inclusão de artigo somente do próprio usuário', async () => {
  const response = await request(app)
      .post('/api/articles')  
      .send({
          writerId: userLogged2.userProfile.id,
          title: 'Tentando incluir artigo com id de outro usuário',
          categoryId: 1,
          htmlFilePath: '',
          route: ''
      })
      .set({ 'authorization': userLogged1.token })

  //insertedArticles.push(response.body)
  expect(response.statusCode).toBe(403)
})

test('Permitir incluir um parágrafo no artigo', async () => {
console.log('******** insertedArticles ==> ', insertedArticles)

  const response = await request(app)
      .post('/api/sectionInArticle')  
      .send({
          articleId: insertedArticles[0].id, 
          sectionId: 'PARAGRAPH', 
          text: 'Exemplo de parágrafo incluído no teste'
      })
      .set({ 'authorization': userLogged1.token })

  insertedSectionsArticles.push(response.body)
  if (response.statusCode != 201) {
    console.log('Erro ===> ', response.message)
  }
  expect(response.statusCode).toBe(201)
})

test('Permitir incluir um subtitulo no artigo', async () => {
  const response = await request(app)
      .post('/api/sectionInArticle')  
      .send({
          articleId: insertedArticles[0].id, 
          sectionId: 'CAPTION', 
          text: 'Primeiro subtitulo'
      })
      .set({ 'authorization': userLogged1.token })

  insertedSectionsArticles.push(response.body)
  if (response.statusCode != 201) {
    console.log('Erro ===> ', response.message)
  }
  expect(response.statusCode).toBe(201)
})

test('Permitir alterar um parágrafo no artigo', async () => {
  const response = await request(app)
      .put('/api/sectionInArticle')  
      .send({
          id: insertedSectionsArticles[0].id,
          text: 'Primeiro parágrafo foi alterado'
      })
      .set({ 'authorization': userLogged1.token })

  insertedSectionsArticles.push(response.body)
  if (response.statusCode != 200) {
    console.log('Erro ===> ', response.message)
  }
  expect(response.statusCode).toBe(200)
})

test('Permitir excluir um parágrafo no artigo', async () => {
  const response = await request(app)
      .post('/api/sectionInArticle')  
      .send({
          id: insertedArticles[0].id,
          sectionId:'PARAGRAPH', 
          text: 'Este parágrafo será excluído'
      })
      .set({ 'authorization': userLogged1.token })

  const sectionInArticle = response.body
  const responseDel = await request(app)
    .delete('/api/sectionInArticle/' + sectionInArticle.id)  
    .set({ 'authorization': userLogged1.token })

  if (responseDel.statusCode != 200) {
    console.log('Erro ===> ', responseDel.message)
  }
  expect(responseDel.statusCode).toBe(200)
})
