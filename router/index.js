const ecokaRoute = require('./ecoka');
const iattRoute = require('./iatt');
const ieltsvietRoute = require('./ieltsviet');

async function routes(fastify) {
  fastify.register(ecokaRoute, { prefix: '/ecoka' });
  fastify.register(iattRoute, { prefix: '/inanhtructuyen' });
  fastify.register(ieltsvietRoute, { prefix: '/ielts-viet' });
}

module.exports = routes;
