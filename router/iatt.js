const { iattController } = require('~/controller');
const fastifyPassport = require('@fastify/passport');

function iattRoute(fastify, options, done) {
    fastify.post('/auth/login', iattController.auth.login);
    // fastify.post('/auth/login/google', iattController.auth.loginWithGoogle);
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
        async function (req, reply) {
            try {
                console.log(req.user);
                const dataAccount = {
                    email: req.user?.emails[0]?.value?.toLowerCase(),
                    password: '',
                    name: req.user?.displayName,
                    status: true,
                    role: 'personal',
                    avatar: '',
                };
                // create account
                reply.redirect(
                    `${process.env.CLIENT_URL}/sso?email=${req.user?.emails[0]?.value?.toLowerCase()}`
                );
            } catch (error) {
                reply.redirect(`${process.env.CLIENT_URL}/sso?email=null`);
            }
        }
    );
    fastify.get('/product/get-all', iattController.product.getAllProducts);
    fastify.get('/blog/get-all', iattController.blog.getAllBlogs);
    done();
}

module.exports = iattRoute;
