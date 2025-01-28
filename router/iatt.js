const { iattController } = require('~/controller');

function iattRoute(fastify, options, done) {
    fastify.get('/product/get-all', iattController.product.getAllProducts);
    fastify.get('/blog/get-all', iattController.blog.getAllBlogs);
    done();
}

module.exports = iattRoute;
