const TestsBase = require('./base');

const Sequelize = require('sequelize');
const BCrypt = require('bcryptjs');
const Errors = require('../helpers/errors');
const DbContext = require('../helpers/sequelize');

const CONFIG_PATH = process.env.NODE_ENV === 'production' ? '../config' : '../config-dev';
const Config = require(CONFIG_PATH);

const context = new DbContext(Sequelize, Config);

const SessionService = require('../services/session');
const UserService = require('../services/user');

const service = new SessionService(context.users, BCrypt, Config, Errors);
const usersService = new UserService(context.users, BCrypt, Config, Errors);

describe('Tests session service', () => {
  it('>> should perform sign in', async () => {
    const user = TestsBase.generateUser();
    const userForAdd = {}; // due to 'user' password will be hashed and not valid for sign in

    Object.assign(userForAdd, user);

    const signInResult = await usersService.create(userForAdd)
    .then(() => service.signIn(user))
    .then(data => data)
    .catch(err => console.log(err));

    expect(signInResult.user).toBeDefined();
    expect(signInResult.user.email).toEqual(user.email);
  });
});