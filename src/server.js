require('dotenv').config()

const chalk = require('chalk')

const app  = require('./app')
const db = require('./db')
const start = require('./config/start')

const package =  require('../package.json')

const START_DB = process.env.START_DB || 'false'
let force_db = false
if (START_DB === 'true') {
    force_db = true
}
const port = process.env.PORT || 3000

app.listen(port, async () => {   
    console.log(chalk.blue('Iniciando o Banco de Dados. Aguarde....'))
    try {
        await db.sync({force: force_db})
        await start.initDataBase()

        console.log('                                       ')
        console.log(chalk.italic.inverse.gray('                                                                   '))
        console.log(chalk.italic.inverse.gray('  ') + chalk.italic.inverse.yellow('                                                               ') + chalk.italic.inverse.gray('  ') )
        console.log(chalk.italic.inverse.gray('  ') + chalk.italic.inverse.yellow(`          O servidor está executando na porta ${port}...          `)+ chalk.italic.inverse.gray('  ') )
        console.log(chalk.italic.inverse.gray('  ') + chalk.italic.inverse.yellow(`                           Versão ${package.version}                        `)+ chalk.italic.inverse.gray('  ') )
        console.log(chalk.italic.inverse.gray('  ') + chalk.italic.inverse.yellow(`                Para finalizar, pressione Ctrl+c               `) + chalk.italic.inverse.gray('  ') )
        console.log(chalk.italic.inverse.gray('  ') + chalk.italic.inverse.yellow('                                                               ')+ chalk.italic.inverse.gray('  ') )
        console.log(chalk.italic.inverse.gray('                                                                   '))
        console.log('                                     ')
    } catch (e) {
        console.log(chalk.red('Erro ao tentar conectar com o banco de dados: ', e))
    }
})