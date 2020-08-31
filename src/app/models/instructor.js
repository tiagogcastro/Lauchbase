const { date } = require('../../lib/utils')

const db = require('../../config/db')

module.exports = {
    // Busca todos os cadastros no banco e retorna na pagina
    all(callback) {
        db.query(`SELECT * FROM instructors`, function(err, results) {
            if(err) {
                return res.send('Database Error!')
            }
            
            callback(results.rows)
        })
    },

    create(data, callback) {

        const query = `
            INSERT INTO instructors (
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `

        const values = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,
            date(Date.now()).iso          
        ]
    
        db.query(query, values, (err, results) => {
            if(err) {
                return res.send('Database Error!')
            }
            callback(results.rows[0])
        })
    },

    // Procura o id do instructor
    find(id, callback) {
        db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function(err, results) {
            if(err) {
                return res.send('Database Error!')
            }

            callback(results.rows[0])
        })
    }
}