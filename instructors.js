const fs = require('fs')

const data = require('./data.json')

const { age } = require('./utils.js')

exports.post = function(req, res) {

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
       
        // Cria a data
        // posso tirar os req.body por ter a variavel com os dados
        birth = Date.parse(birth) // vai ser alterado
        const created_at = Date.now() // req.body.birth cria uma data
        const id = Number(data.instructors.length + 1)
    
        // [] vazio
        data.instructors.push({
            id,
            avatar_url,
            name,
            birth,
            gender,
            services,
            created_at,
        }) // [{retorna array com obj}]
    
        // Vai criar um arquivo json e salvar os dados quando cadastrado
        fs.writeFile("data.json", JSON.stringify(data, null,  2), function (err) {
            if (err){ 
                return res.send('write file error!')
            } 
            
            return res.redirect('/instructors')
        })
    }
    
// show
exports.show = function(req, res) {
    // req.params
    const { id } = req.params

    // Vai procurar se tem o id 
    const foundInstructor = data.instructors.find( (instructor) => {
        return id == instructor.id
    })

    // se nao tiver vai ter msg de erro
    if (!foundInstructor) {
        return res.send('Instructors not found!')
    }

    // age

    // Alterando os dados
    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(','),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at)
    }

    // se tiver vai retornar
    return res.render('instructors/show', { instructor: instructor})
}   

// Recebendo na pagina instructors os dados do create.

// update

// delete