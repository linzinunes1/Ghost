const debug = require('@tryghost/debug')('shared:express');
const express = require('express');
const sentry = require('./sentry');
const {auth} = require('express-openid-connect');

module.exports = (name) => {
    debug('new app start', name);
    const app = express();
    app.set('name', name);

    // Make sure 'req.secure' is valid for proxied requests
    // (X-Forwarded-Proto header will be checked, if present)
    app.enable('trust proxy');

    // Sentry must be our first error handler. Mounting it here means all custom error handlers will come after
    app.use(sentry.errorHandler);

    // Configure Passport to use Auth0
    const config = {
        authRequired: false,
        auth0Logout: true,
        baseURL: 'http://localhost:2368',
        clientID: 'zdJHLi8MJK5NdyrcN5sAzGxPmIIxCyLi',
        issuerBaseURL: 'https://redventures-dev.auth0.com',
        secret: 'LONG_RANDOM_STRING'
    };

    // auth router attaches /login, /logout, and /callback routes to the baseURL
    // app.use(auth(config));

    // req.isAuthenticated is provided from the auth router
    //app.get('/', (req, res) => {
    //    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
    //});

    debug('new app end', name);
    return app;
};

// Wrap the main express router call
// This is mostly an experiement, and can likely be removed soon
module.exports.Router = (name, options) => {
    debug('new Router start', name);
    const router = express.Router(options);

    router.use(sentry.errorHandler);

    debug('new Router end', name);
    return router;
};

module.exports.static = express.static;

// Export the OG module for testing based on the internals
module.exports._express = express;
