const fs = require('fs')

const data = require('../data.json')

// Desestruturando
const { age, date } = require('../utils')

exports.index = function (req, res) {
    return res.render('members/index', {members: data.members})
}

// show - apresentar os dados na tela
exports.show = function(req, res) {
    // req.params
    const { id } = req.params

    // Vai procurar se tem o id 
    const foundMember = data.members.find( (member) => {
        return id == member.id
    })

    // se nao tiver vai ter msg de erro
    if (!foundMember) {
        return res.send('members not found!')
    }

    // age

    // Alterando os dados
    const member = {
        ...foundMember,
        age: age(foundMember.birth),
        // created_at: Intl.DateTimeFormat('pt-BR').format(foundMember.created_at)
    }

    // se tiver vai retornar
    return res.render('members/show', { member: member})
}    

exports.create =  function(req, res) {
    return res.render('members/create')
}

// Recebendo na pagina members os dados do create.
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

        // Cria a data
        // posso tirar os req.body por ter a variavel com os dados
        birth = Date.parse(req.body.birth) // vai ser alterado
        const created_at = Date.now()

        let id = 1
        const lastMember = data.members[data.members.length - 1]

        if (lastMember) {
            id = lastMember.id + 1
        }
 
        data.members.push({
            id,
            ...req.body,
            birth,
            created_at
        }) // [{retorna array com obj}]
    
        // Vai criar um arquivo json e salvar os dados quando cadastrado
        fs.writeFile("data.json", JSON.stringify(data, null,  2), function (err) {
            if (err){ 
                return res.send('write file error!')
            } 
            
            return res.redirect(`/members/${id}`)
        })
}

exports.edit = function (req, res) {
     // req.params
     const { id } = req.params

     // Vai procurar se tem o id 
     const foundMember = data.members.find( (member) => {
         return id == member.id
     })
 
     // se nao tiver vai ter msg de erro
     if (!foundMember) {
         return res.send('members not found!')
     }

     // organizando os dados em um obj
     const member = {
         ...foundMember,
         birth: date(foundMember.birth) 
         
     }

    return res.render('members/edit', {member })
}

// Put Vai atualizar os dados no editar
exports.put = function (req, res) {
     const { id } = req.body

    let index = 0
     // Vai procurar se tem o id 
     const foundMember = data.members.find( (member, foundIndex) => {
         if ( id == member.id ) {
             // Atualiza o index
             index = foundIndex
             // se achar retorna true
             return true
         }
     })
 
     // se nao tiver vai ter msg de erro
     if (!foundMember) {
         return res.send('members not found!')
     }

     // pega os dados que modificaram
     const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id) 
     }

     // Após achar o id == da edit vai atualizar no local certo
     data.members[index] = member

     // Joga no mesmo id no data.json
     fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
         if (err) {
             return res.send('Write error!')
         }

         return res.redirect(`/members/${id}`)
     })
}

exports.delete = function(req, res) {
    const { id } = req.body

    // Filtra, para cada instrutor vai retornar algo boolean
    const filteredmembers = data.members.filter(function(member) {
        // diferente 
        return member.id != id
    })

    data.members = filteredmembers

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function (err) {
        if (err) {
            return res.send('write file error!')
        }

        return res.redirect('/members')
    })
}


