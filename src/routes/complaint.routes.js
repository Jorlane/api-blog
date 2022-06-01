const Complaint = require("../models/complaint.js")

module.exports = app => {
    const complaint = require("../service/complaint.service.js")
    const auth = require('../config/auth')

    //Public routes
    var router = require("express").Router()
    router.post("/", complaint.create)
    app.use('/oapi/complaints', router)

    // Private Routes
    var privateRouter = require("express").Router()
    privateRouter.use(auth)
    privateRouter.get("/", complaint.findAll)
    privateRouter.get("/pending/", complaint.findAllPending)
    privateRouter.get("/:id", complaint.findById)
    privateRouter.put("/:id", complaint.update) 
    app.use('/api/complaints', privateRouter)

  }