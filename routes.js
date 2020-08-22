const express = require('express')
const routes = express.Router() // criando a rota dos metodos get
const instructors = require("./instructors")

routes.get('/', function (req, res) {
    return res.redirect('/instructors')
})



routes.get('/instructors', function (req, res) {
    return res.render('instructors/index')
})

routes.get('/instructors/create', function(req, res) {
    return res.render('instructors/create')
})

// ve o id
routes.get('/instructors/:id', instructors.show)

// para ir na page de editar
routes.get('/instructors/:id/edit', instructors.edit)

// para editar
routes.put('/instructors', instructors.put)

// para deletar
routes.delete('/instructors', instructors.delete)

routes.post('/instructors', instructors.post) // recebendo a function do arquivo instructors.js

routes.get('/members', function (req, res) {
    return res.send('members')
})

module.exports = routes


// get: Receber RESOURCE
// Post: Criar um novo RESOURCER com dados enviados
// put: Atualizar RESOURCE
// delete: Deletar RESOURCE