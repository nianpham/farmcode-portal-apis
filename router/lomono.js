const { lomonoController } = require('~/controller');

function lomonoRoute(fastify, options, done) {
    fastify.post('/test', lomonoController.test.start);
    done();
}

module.exports = lomonoRoute;
