const { iattController } = require('~/controller');
const fastifyPassport = require('@fastify/passport');

function iattRoute(fastify, options, done) {
    fastify.post('/auth/login', iattController.auth.login);
    fastify.get(
        '/auth/login/google',
        {
            preValidation: fastifyPassport.authenticate('google', {
                scope: ['profile', 'email'],
            }),
        },
        async () => {
            console.log(
                '>>>>> Redirecting to Google for Authentication <<<<<<'
            );
        }
    );
    fastify.get(
        '/auth/login/google/callback',
        {
            preValidation: fastifyPassport.authenticate('google', {
                failureRedirect: process.env.CLIENT_URL,
            }),
        },
        iattController.auth.loginWithGoogle
    );

    fastify.get('/account/', iattController.account.getAllAccounts);
    fastify.get('/account/:id', iattController.account.getAccount);

    fastify.get('/product/', iattController.product.getAllProducts);
    fastify.get('/product/:id', iattController.product.getProduct);
    fastify.post('/product/', iattController.product.createProduct);
    fastify.put('/product/:id', iattController.product.updateProduct);
    fastify.delete('/product/:id', iattController.product.deleteProduct);

    fastify.get('/blog/', iattController.blog.getAllBlogs);
    fastify.get('/blog/:id', iattController.blog.getBlog);
    fastify.post('/blog/', iattController.blog.createBlog);
    fastify.put('/blog/:id', iattController.blog.updateBlog);
    fastify.delete('/blog/:id', iattController.blog.deleteBlog);

    fastify.get('/order/', iattController.order.getAllOrders);
    fastify.get('/order/:id', iattController.order.getOrder);
    fastify.post('/order/', iattController.order.createOrder);
    fastify.put('/order/:id', iattController.order.updateOrder);
    fastify.delete('/order/:id', iattController.order.deleteOrder);
    
    done();
}

module.exports = iattRoute;
