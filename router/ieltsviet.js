const { ieltsvietController } = require('~/controller');

function ieltsvietRoute(fastify, options, done) {
    fastify.get('/slider/', ieltsvietController.slider.getAllSliders);
    fastify.post('/slider/', ieltsvietController.slider.createSlider);
    fastify.delete('/slider/:id', ieltsvietController.slider.deleteSlider);

    fastify.get('/review/', ieltsvietController.review.getAllReviews);
    fastify.get('/review/:id', ieltsvietController.review.getReview);
    fastify.post('/review/', ieltsvietController.review.createReview);
    fastify.put('/review/:id', ieltsvietController.review.updateReview);
    fastify.delete('/review/:id', ieltsvietController.review.deleteReview);

    fastify.get('/blog/', ieltsvietController.blog.getAllBlogs);
    fastify.get('/blog/:id', ieltsvietController.blog.getBlog);
    fastify.post('/blog/', ieltsvietController.blog.createBlog);
    fastify.put('/blog/:id', ieltsvietController.blog.updateBlog);
    fastify.delete('/blog/:id', ieltsvietController.blog.deleteBlog);

    fastify.get('/account/', ieltsvietController.account.getAllAccounts);
    fastify.get('/account/:id', ieltsvietController.account.getAccount);
    fastify.post('/account/', ieltsvietController.account.createAccount);
    fastify.put('/account/:id', ieltsvietController.account.updateAccount);
    fastify.delete('/account/:id', ieltsvietController.account.deleteAccount);
    fastify.post('/account/:id', ieltsvietController.account.login);
    fastify.post('/account/check/:id', ieltsvietController.account.check);

    fastify.get('/timekeeping/', ieltsvietController.timekeeping.getAllTimekeepings);
    fastify.get('/timekeeping/:id', ieltsvietController.timekeeping.getTimekeeping);
    done();
}

module.exports = ieltsvietRoute;
