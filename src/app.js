const express = require('express')
const cors = require('cors')

const associations = require('./models/associations')

const app = express()
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Página principal')
})

// set port, listen for requests
require("./routes/category.routes")(app)
require("./routes/user.routes")(app)
require("./routes/writer.routes")(app)
require("./routes/article.routes")(app)
require("./routes/sectionInArticle.routes")(app)

module.exports = app