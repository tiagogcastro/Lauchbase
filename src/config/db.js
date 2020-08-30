const { Pool } = require('pg')

module.exports = new Pool({
    user: 'postgres',
    password: "db100tg1",
    host: 'localhost',
    port: 5432,
    database: 'gynmanager'
})