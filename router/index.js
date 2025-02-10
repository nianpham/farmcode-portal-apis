const ecokaRoute = require('./ecoka');
const iattRoute = require('./iatt');
const ieltsvietRoute = require('./ieltsviet');
const lomonoRoute = require('./lomono');

async function routes(fastify) {
  fastify.register(ecokaRoute, { prefix: '/ecoka' });
  fastify.register(iattRoute, { prefix: '/inanhtructuyen' });
  fastify.register(ieltsvietRoute, { prefix: '/ielts-viet' });
  fastify.register(lomonoRoute, { prefix: '/lomono' });
}

module.exports = routes;
