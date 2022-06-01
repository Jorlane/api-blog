const Connection = require("../models/connection.js")

module.exports = app => {
    const connection = require("../service/connection.service.js")
    const auth = require('../config/auth')

    //Public routes
    var router = require("express").Router()
    router.get("/qtdfollowers/:writerId", connection.countFollowers)
    app.use('/oapi/connections', router)
    
    
    // Private Routes
    var privateRouter = require("express").Router()
    privateRouter.use(auth)
    privateRouter.post("/", connection.create)
    privateRouter.delete("/:writerId", connection.delete)
    privateRouter.get("/:writerId", connection.findOne)
    privateRouter.get("/followers/:writerId", connection.findByWriterId)
    privateRouter.get("/following/:userId", connection.findByUserId)
    app.use('/api/connections', privateRouter)
  }