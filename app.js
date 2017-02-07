const Express = require('express');
const Sequelize = require('sequelize');

const DbContext = require('./helpers/sequelize');

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

const usersService = new UserService(context.users, errors);
const domainsService = new DomainService(context.domains, errors);

const sessionRouter = new SessionRouter(Express, usersService);
const userRouter = new UserRouter(Express, usersService);
const domainRouter = new DomainRouter(Express, domainsService);

// -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- //

app.use('/sessions', sessionRouter);
app.use('/users', userRouter);
app.use('/domains', domainRouter);

app.listen(3000, function() {
    console.log('Server running...');
});
