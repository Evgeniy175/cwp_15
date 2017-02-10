const Express = require('express');
const Sequelize = require('sequelize');

const Jwt = require('jsonwebtoken');
const CookieParser = require('cookie-parser');
const BodyParser = require('body-parser');

const Request = require('request');

const DbContext = require('./helpers/sequelize');

const SessionService = require('./services/session');
const UserService = require('./services/user');
const DomainService = require('./services/domain');

const SessionRouter = require('./routers/session');
const UserRouter = require('./routers/user');
const DomainRouter = require('./routers/domain');

// -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- //

const config = require('./config.json');
const errors = require('./helpers/errors');

const app = Express();
const context = new DbContext(Sequelize, config);

const sessionsService = new SessionService(context.users, Jwt, config, errors);
const usersService = new UserService(context.users, Jwt, config, errors);
const domainsService = new DomainService(Request, context.domains, context.users, context.userDomains, context.userPayments, config, errors);

const sessionRouter = new SessionRouter(Express, sessionsService, usersService, config, errors);
const userRouter = new UserRouter(Express, usersService);
const domainRouter = new DomainRouter(Express, domainsService);

// -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- //

app.set('secret', config.jwt.secret)

app.use(BodyParser.json());
app.use(CookieParser(config.cookie.authKey));

app.use('/', sessionRouter);
app.use('/users', userRouter);
app.use('/domains', domainRouter);

app.listen(3000, function() {
    console.log('Server running...');
});
