import mysql from 'mysql'

const connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'sgroup_be'
})

connection.getConnection((err) => {
    if (err) {
        console.log('Error connecting to Db ' + err)
        return
    }
    console.log('Connected to MySQL')
})

export { connection as db }