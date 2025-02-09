const { ieltsvietController } = require('~/controller');

function ieltsvietRoute(fastify, options, done) {
    fastify.get('/slider/', ieltsvietController.slider.getAllSliders);
    fastify.put('/slider/', ieltsvietController.slider.updateSliders);

    fastify.get('/review/', ieltsvietController.review.getAllReviews);
    fastify.get('/review/:id', ieltsvietController.review.getReview);
    fastify.post('/review/', ieltsvietController.review.createReview);
    fastify.put('/review/:id', ieltsvietController.review.updateReview);
    fastify.delete('/review/:id', ieltsvietController.review.deleteReview);
    done();
}

module.exports = ieltsvietRoute;
