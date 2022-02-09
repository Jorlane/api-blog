module.exports = app => {
    const user = require("../service/user.service.js")
    const auth = require('../config/auth')
    const multer  = require('multer')
    const path = require('path')

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/images');
        },
        filename: function (req, file, cb) {
            console.log('file.originalname ===> ', file.originalname)
            console.log('file.originalname.indexOf ===> ', file.originalname.indexOf('.'))
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    });
    const upload = multer({ storage });

    // Public routes
    var router = require("express").Router()
    router.get("/:id", user.getPublicProfile)
    router.post("/login", user.login)
    router.post("/signup", user.signup)
    router.post("/validate", user.validateToken)
    router.post("/profile/image",  upload.single('file'), user.uploadImageProfile)
    app.use('/oapi/users', router)

    // Private routes
    var privateRouter = require("express").Router()
    privateRouter.use(auth)
    privateRouter.put("/", user.updateProfile)
    privateRouter.get("/:id", user.getOwnProfile)
    privateRouter.delete("/:id", user.deleteOwnProfile)
    app.use('/api/users', privateRouter)

  }