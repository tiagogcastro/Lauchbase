const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')

const server = express()

server.use(express.urlencoded({extended: true}))
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

// config o njk
server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server,
    autoescape: false, // Permite colocar tags html dentro das variaveis
    noCache: true
})

server.listen(5000, function () {
    console.log('Servidor iniciou ou atualizou!')
})

//
