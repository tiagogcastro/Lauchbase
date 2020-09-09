const express = require('express')
const routes = express.Router()
const ProductController = require('./app/controllers/ProductController')
const multer = require('./app/midlewares/multer')

routes.get('/', function (req, res) {
    return res.render('layout.njk')
})

routes.get('/products/create', ProductController.create)
routes.get('/products/:id/edit', ProductController.edit)

const getMulter = multer.array("photos", 6)

routes.post('/products', getMulter, ProductController.post)
routes.put('/products', getMulter, ProductController.put)
routes.delete('/products', ProductController.delete)


// Alias
routes.get('/ads/create', function (req, res) {
    return res.render('/products/create')
})

module.exports = routes
