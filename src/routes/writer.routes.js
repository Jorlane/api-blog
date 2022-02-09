module.exports = app => {
    const writer = require("../service/writer.service.js")
    const auth = require('../config/auth')

    // public routes
    var router = require("express").Router()
    router.get("/", writer.findAll)
    router.get("/:userId", writer.findById)
    app.use('/oapi/writers', router)

    // private routes
    var privateRouter = require("express").Router()
    privateRouter.use(auth)
    privateRouter.post("/", writer.create)
    privateRouter.delete("/:userId", writer.delete)
    app.use('/api/writers', privateRouter)
  }