module.exports = app => {
    const comment = require("../service/comment.service.js")
    const auth = require('../config/auth')

    //Public routes
    var router = require("express").Router()
    router.get("/:articleId", comment.findValidsByArticle)
    router.get("/:status", comment.findByStatus)
    app.use('/oapi/comments', router)

    // Private Routes
    var privateRouter = require("express").Router()
    privateRouter.use(auth)
    privateRouter.get("/:id", comment.findById)
    privateRouter.post("/", comment.create)
    privateRouter.put("/:id", comment.update)
    privateRouter.delete("/:id", comment.deleteById)
    privateRouter.delete("/deleteByArticle/:articleId", comment.deleteByArticle)
    app.use('/api/comments', privateRouter)

  }