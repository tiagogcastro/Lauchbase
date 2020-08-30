const { age, date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    index(req, res) {
        // const instructors = data.instructors.map((instructor) => {
        //     return {
        //         ...instructor,
        //         services: instructor.services.split(','),
        //     }
        // }) 
        return res.render('instructors/index')
    },
    create(req, res) {
        return res.render('instructors/create')
    },
    post(req, res) {

        // validação
        const keys = Object.keys(req.body) 
        
        for(key of keys) {
            req.body[key] // req.body.key == ""
            if (req.body[key] == "") {
                return res.send('Please, fill all fields')
            }
        }

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
            req.body.name,
            req.body.avatar_url,
            req.body.gender,
            req.body.services,
            date(req.body.birth).iso,
            date(Date.now()).iso
            
        ]
    
        db.query(query, values, (err, results) => {
            if(err) {
                return res.send('Database Error!')
            }
            return res.redirect(`/instructors/${results.rows[0].ud}`)
        })

    },
    show(req, res) {
       return
    },
    edit(req, res) {
       return
    },
    put(req, res) {
       // validação
        const keys = Object.keys(req.body) 
        
        for(key of keys) {
           req.body[key] // req.body.key == ""
           if (req.body[key] == "") {
               return res.send('Please, fill all fields')
           }
       }

       return
    },
    delete(req, res) {
       return
    }
}