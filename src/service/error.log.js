const chalk = require('chalk')

exports.log = (module, method, sqlErr) => {
    let messageToReturn = ''
    console.log(chalk.bold.red('* * * Error'))
    console.log(chalk.red(`Error on module ${module} at method ${method} `))
    if (sqlErr.original) {
        console.log(chalk.red(`Sql Error code :  ${sqlErr.original.code}`))
        console.log(chalk.red(`Sql Error message :  ${sqlErr.original.sqlMessage}`))
        console.log(chalk.red(`Sql:  ${sqlErr.original.sql}`))
        console.log(chalk.red('Sql parameters: ', chalk.gray(sqlErr.original.parameters)))
        messageToReturn = sqlErr.original.sqlMessage
    } else {
        console.log(chalk.red(`Error:  ${sqlErr}`))
        messageToReturn = 'Error. Verify server log.' 
    }
    console.log(chalk.bold.red('* * * End Error'))
    return messageToReturn
}