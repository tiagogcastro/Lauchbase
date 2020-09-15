const { formatPrice, date } = require('../../lib/utils')

const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')

module.exports = {
    async index(req, res) {

        let results = await Product.all()
        const products = results.rows

        if (!products) {
            return res.send('Products not found!')
        }

        async function getImage(productId) {
            let results = await Product.files(productId)
        // Retornar somente o caminho das imagens
            const files = results.rows.map(file =>`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
            return files[0]
        }

        // Return array
        const productsPromise = products.map(async product => {
            product.img = await getImage(product.id)
            product.oldPrice = formatPrice(product.old_price)
            product.price = formatPrice(product.price)
            return product
        }).filter((product, index) => 
            // arrow func não precisa return nem {} qnd o return for direto
            index > 2 ? false : true
        )

        const lastAdded = await Promise.all(productsPromise)

        return res.render("home/index", {products: lastAdded})
    }
}