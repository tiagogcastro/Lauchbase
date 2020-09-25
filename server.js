const express = require('express')
const nunjucks = require('nunjucks')
const videos = require('./data')

const server = express()

server.use(express.static('public'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server,
    autoescape: false, // Permite colocar tags html dentro das variaveis
    noCache: true
})

server.get('/', function(req, res) {
    const about = {
        avatar_url: "https://media-exp1.licdn.com/dms/image/C4D03AQGUgkAbku-Wkg/profile-displayphoto-shrink_200_200/0?e=1601510400&v=beta&t=bvo3aTYGvEh91y61a0fBuMuHP6SPm-6JpG95z_5ZOeY",

        name: "Tiago Gonçalves",

        role: "Web Developer student",

        description: 'Aqui vou falar sobre mim. <a href="#" target="_blank"> Algum Link</a>',

        links: [
            { name: 'Github', url: 'https://github.com/Tiaguin061'},
            { name: 'instagram', url: 'https://www.instagram.com/tg001_xx'},
            { name: 'linkedin', url: 'https://www.linkedin.com/in/tiagogoncalves200428'}
        ]
    }

    return res.render('about', {about})
})

server.get('/portifolio', function(req, res) {
    return res.render('portifolio', {items: videos})
})

server.get("/video", function (req, res) {
    const id = req.query.id 

    const video = videos.find(function(video) { // encontra o id
        return video.id == id // Poupa codico, retorna se for true ou false
    })

    if(!video) {
        return res.send('Video not found!')
    }

    return res.render('video', {item: video})

    res.send(id)
})


server.listen(5000, function () {
    console.log('Servidor iniciou ou atualizou!')
})