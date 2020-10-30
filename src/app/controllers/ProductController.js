const { formatPrice, date } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

const { onlyUsers } = require('../middlewares/session')

module.exports = {
    async create(req, res) {
        // Pegar categorias
        try{
            const results = await Category.all()
            let categories = results.rows
            return res.render('products/create', { categories })
        } catch(err) {
            return res.render('products/create', {
                categories,
                error: "Houve um erro inesperado ou não foi possível carregar as categorias."
            })
        }

    },

    async post(req, res) {
        const keys = Object.keys(req.body) 

        for(key of keys) {
            if (req.body[key] == "") {
                const results = await Category.all()
                let categories = results.rows
                return res.render(`products/create`, {
                    categories,
                    product: req.body,
                    error: 'Por favor, preencha todos os campos!'
                })
            }
        }

        if (req.files.length == 0) {
            return res.render(`products/create`, {
                product: req.body,
                error: 'Por favor, coloque pelo menos uma imagem! '
            })
        }

        req.body.user_id = req.session.userId

        // Get categories
        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({...file, product_id: productId
        })) 
        // Vai esperar criar as img
        await Promise.all(filesPromise)

        return res.redirect(`/products/${productId}/edit`)

    },

    async show(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0] 

        if(!product && req.session.userId) {
            return res.render('products/create', {
                error: "Produto não encontrado. Crie um agora!"
            })
        }

        if (!product && onlyUsers) {
            return res.render('session/login', {
                error: "Produto não encontrado. Entre em sua conta e crie um agora!"
            })
        }

        const { day, hour, minutes, month} = date(product.updated_at)

        product.published = {
            day: `${day}/${month}`,
            hour: `${hour}h${minutes}`
        }

        product.oldPrice = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        results = await Product.files(product.id)
        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render("products/show", {product, files})
    },

    async edit(req, res) {
        // Pegando os produtos e todas as categorias
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if(!product) {
            return res.render('products/edit.njk', {
                error: "Produto não encontrado!"
            })
        }

        product.price = formatPrice(product.price)
        product.old_price = formatPrice(product.old_price)

        // Get categories
        results = await Category.all()
        const categories = results.rows

        // Get images
        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render('products/edit.njk', { product, categories, files})
    },

    async put(req, res) {
        const keys = Object.keys(req.body) 

        for(key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.render(`products/edit/${req.body.id}`, {
                    product: req.body,
                    error: 'Por favor, preencha todos os campos! '
                })
            } 
        }

        if(req.files.length != 0) {
            const newFilesPromise = req.files.map(file => 
                File.create({...file, product_id: req.body.id}))
            await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",") // [1,2,3,]
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1) // [1,2,3]

            const removedFilesPromise = removedFiles.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        // Vai riscar o old_price
        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id) 
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)
    },

    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')
    }
}