const { lomonoController } = require('~/controller');

function lomonoRoute(fastify, options, done) {
    fastify.post('/check', lomonoController.test.start);
    done();
}

module.exports = lomonoRoute;
