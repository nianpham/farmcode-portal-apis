const ecokaRoute = require('./ecoka');

async function routes(fastify) {
  fastify.register(ecokaRoute, { prefix: '/ecoka' });
}

module.exports = routes;
