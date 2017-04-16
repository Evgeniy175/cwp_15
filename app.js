const Express = require('express');
const Sequelize = require('sequelize');

const Jwt = require('jsonwebtoken');
const CookieParser = require('cookie-parser');
const BodyParser = require('body-parser');
const BCrypt = require('bcryptjs');
const Js2XmlParser = require('js2xmlparser');

const Request = require('request');

const CONFIG_PATH = process.env.NODE_ENV === 'production' ? './config' : './config-dev';
const Config = require(CONFIG_PATH);
const Errors = require('./helpers/errors');
const DbContext = require('./helpers/sequelize');
const ExpressExtensions = require('./helpers/express')(Express, Config, Js2XmlParser);

const SessionService = require('./services/session');
const UserService = require('./services/user');
const DomainService = require('./services/domain');
const PaymentService = require('./services/payment');

const SessionRouter = require('./routers/session');
const UserRouter = require('./routers/user');
const DomainRouter = require('./routers/domain');
const PaymentRouter = require('./routers/payment');
const PermissionRouter = require('./routers/permission');
const AvailableDomainsRouter = require('./routers/available-domains');

// -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- //

const app = Express();

const context = new DbContext(Sequelize, Config);

const sessionsService = new SessionService(context.users, BCrypt, Config, Errors);
const usersService = new UserService(context.users, BCrypt, Config, Errors);
const domainsService = new DomainService(Request, context.domains, context.users, context.userDomains, Config, Errors);
const paymentsService = new PaymentService(Request, context.userDomains, context.userPayments, Config, Errors);

const sessionRouter = new SessionRouter(Express, sessionsService, Jwt, Config, Errors);
const userRouter = new UserRouter(Express, Config, usersService);
const domainRouter = new DomainRouter(Express, domainsService, Config);
const paymentRouter = new PaymentRouter(Express, paymentsService, Config);
const permissionRouter = new PermissionRouter(Express, Jwt, Config, Errors);
const availableDomainsRouter = new AvailableDomainsRouter(Express, domainsService, Config);

// -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- //

app.use(BodyParser.json());
app.use(CookieParser(Config.cookies.secret));

app.use('/', permissionRouter);
app.use('/sessions', sessionRouter);
app.use('/users', userRouter);
app.use('/domains', domainRouter);
app.use('/payments', paymentRouter);
app.use('/available-domains', availableDomainsRouter);

const server = app.listen(process.env.PORT || 3000, function() {
    console.log('Server running...');
});

module.exports = server;
