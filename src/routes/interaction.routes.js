module.exports = app => {
    const interaction = require("../service/interaction.service.js")
    const auth = require('../config/auth')

    //Public routes
    var router = require("express").Router()
    router.get("/:articleId", interaction.findAll)
    app.use('/oapi/interactions', router)

    // Private Routes
    var privateRouter = require("express").Router()
    privateRouter.use(auth)
    privateRouter.post("/registerReading/", interaction.registerReading)
    privateRouter.post("/putLike/", interaction.putLike)
    privateRouter.post("/removeLike/", interaction.removeLike)
    app.use('/api/interactions', privateRouter)
}