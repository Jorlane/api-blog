module.exports = app => {
    const category = require("../service/category.service.js")
    const authAdmin = require('../config/authAdmin')

    //Public routes
    var router = require("express").Router()
    router.get("/", category.findAll)
    router.get("/:id", category.findById)
    app.use('/oapi/categories', router)

    // Admin Routes
    var adminRouter = require("express").Router()
    adminRouter.use(authAdmin)
    adminRouter.post("/", category.create)
    adminRouter.delete("/:id", category.delete)
    app.use('/api/categories', adminRouter)
  
  }