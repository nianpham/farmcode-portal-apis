const ecokaRoute = require('./ecoka');
const iattRoute = require('./iatt');

async function routes(fastify) {
  fastify.register(ecokaRoute, { prefix: '/ecoka' });
  fastify.register(iattRoute, { prefix: '/inanhtructuyen' });
}

module.exports = routes;
