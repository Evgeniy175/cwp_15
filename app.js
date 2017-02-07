const Express = require('express');
const Sequelize = require('sequelize');

const DbContext = require('./helpers/sequelize');

const UserService = require('./services/user');
const DomainService = require('./services/domain');

const AuthRouter = require('./routers/auth');
const UserRouter = require('./routers/user');
const DomainRouter = require('./routers/domain');

// -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- //

const config = require('./config.json');
const errors = require('./helpers/errors');

const app = Express();
const context = new DbContext(Sequelize, config);

const usersService = new UserService(context.users, errors);
const domainsService = new DomainService(context.domains, errors);

const authRouter = new AuthRouter(Express, usersService);
const userRouter = new UserRouter(Express, usersService);
const domainRouter = new DomainRouter(Express, domainsService);

// -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- // -- //

app.use('/users', userRouter)

app.listen(3000, function() {
    console.log('Server running...');
});
