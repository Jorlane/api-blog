module.exports = app => {
    const sectionInArticle = require("../service/sectionInArticle.service.js")
    const auth = require('../config/auth')
    const multer  = require('multer')
    const path = require('path')
    const fs = require('fs')

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const path = 'public/images/article'
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, {recursive: true})
            }
            cb(null, path);
        },
        filename: function (req, file, cb) {
            console.log('file.originalname ===> ', file.originalname)
            console.log('file.originalname.indexOf ===> ', file.originalname.indexOf('.'))
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    });
    const upload = multer({ storage });

    var router = require("express").Router()
    router.post("/image",  upload.single('file'), sectionInArticle.uploadImage)
    app.use('/oapi/sectionInArticle', router)

    // private routes
    var privateRouter = require("express").Router()
    privateRouter.use(auth)
    privateRouter.post("/", sectionInArticle.create)
    privateRouter.put("/", sectionInArticle.update)
    privateRouter.delete("/:id", sectionInArticle.delete)
    privateRouter.post("/images", sectionInArticle.deleteImageFiles)
    app.use('/api/sectionInArticle', privateRouter)
  }