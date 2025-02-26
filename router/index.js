const ecokaRoute = require('./ecoka');
const iattRoute = require('./iatt');
const ieltsvietRoute = require('./ieltsviet');
const lomonoRoute = require('./lomono');
const helperRoute = require('./helper');

async function routes(fastify) {
  fastify.register(helperRoute, { prefix: '/helper' });
  fastify.register(ecokaRoute, { prefix: '/ecoka' });
  fastify.register(iattRoute, { prefix: '/inanhtructuyen' });
  fastify.register(ieltsvietRoute, { prefix: '/ielts-viet' });
  fastify.register(lomonoRoute, { prefix: '/bot-bridge' });
}

module.exports = routes;
