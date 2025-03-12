const { ecokaController } = require('~/controller');

function ecokaRoute(fastify, options, done) {
    fastify.get('/product', ecokaController.product.getAllProducts);
    fastify.get('/product/:id', ecokaController.product.getProductById);
    fastify.post('/product/', ecokaController.product.createProduct);
    fastify.put('/product/:id', ecokaController.product.updateProduct);
    fastify.delete('/product/:id', ecokaController.product.deleteProduct);
    done();
}

module.exports = ecokaRoute;
