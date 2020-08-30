const { age, date } = require('../../lib/utils')

module.exports = {
    index(req, res) {
        const members = data.members.map((member) => {
            return {
                ...member,
                services: member.services.split(','),
            }
        }) 
        return res.render('members/index')
    },
    create(req, res) {
        return res.render('members/create')
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

    // tratamento dos dados
    // destruturando os dados
        let {avatar_url, birth, name, services, gender} = req.body
    
        return

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