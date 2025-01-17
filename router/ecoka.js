const { ecokaController } = require('~/controller');

function ecokaRoute(fastify, options, done) {
    fastify.get('/product/get-all', ecokaController.product.getAllProducts);
    done();
}

module.exports = ecokaRoute;
