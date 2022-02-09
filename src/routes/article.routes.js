module.exports = app => {
    const article = require("../service/article.service.js")
    const sectionInArticle = require("../service/sectionInArticle.service.js")
    const auth = require('../config/auth')

    // public routes
    var router = require("express").Router()
    router.get("/", article.findAll)
    router.get("/:id", article.findById)
    router.get("/bywriter/:writerId", article.findAllPublishedByWriter)
    app.use('/oapi/articles', router)

    // private routes
    var privateRouter = require("express").Router()
    privateRouter.use(auth)
    privateRouter.get("/:id", article.findById)
    privateRouter.post("/", article.create)
    privateRouter.put("/", article.update)
    privateRouter.get("/articlesByWriter/:writerId", article.findArticlesByWriter)
    privateRouter.get("/draftArticlesByWriter/:writerId", article.findDraftArticlesByWriter)
    privateRouter.get("/publishedArticlesByWriter/:writerId", article.findPublishedArticlesByWriter)
    privateRouter.get("/unpublisheArticlesByWriter/:writerId", article.findUnpublishedArticlesByWriter)
    privateRouter.delete("/:id", article.delete)
    app.use('/api/articles', privateRouter)

    // private routes
    var privateRouterSections = require("express").Router()
    privateRouterSections.use(auth)
    privateRouterSections.delete("/:articleId", sectionInArticle.deleteAllSectionByArticleId)
    app.use('/api/articles/sections', privateRouterSections)
  
  }