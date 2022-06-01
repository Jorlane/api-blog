const express = require('express')
const cors = require('cors')

require('dotenv').config()

const associations = require('./models/associations')

const app = express()
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(cors())

const environment = process.env.ENVIRONMENT
if (environment.toUpperCase() === 'DEV') {
    app.use(express.static('public'))
} else {
    app.use('/images', express.static(__dirname + '/public/images'));
}

app.get('/', (req, res) => {
    res.send('Página principal')
})

// set port, listen for requests
require("./routes/category.routes")(app)
require("./routes/user.routes")(app)
require("./routes/writer.routes")(app)
require("./routes/article.routes")(app)
require("./routes/sectionInArticle.routes")(app)
require("./routes/comment.routes")(app)
require("./routes/interaction.routes")(app)
require("./routes/complaint.routes")(app)
require("./routes/connection.routes")(app)

module.exports = app