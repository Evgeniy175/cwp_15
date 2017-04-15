const TestsBase = require('../base');


const BCrypt = require('bcryptjs');
const Errors = require('../../helpers/errors');
const DbContext = require('../../helpers/sequelize');

const CONFIG_PATH = process.env.NODE_ENV === 'production' ? '../../config' : '../../config-dev';
const Config = require(CONFIG_PATH);

const SessionService = require('../../services/session');
const UserService = require('../../services/user');

const Repository = require('../mocks/repository');

const usersRepo = new Repository();

const service = new SessionService(usersRepo, BCrypt, Config, Errors);
const usersService = new UserService(usersRepo, BCrypt, Config, Errors);

describe('Tests session service', () => {
  beforeEach(() => usersRepo.mockClear());

  it('>> should perform sign in', async () => {
    let signInResult = {};
    const user = TestsBase.generateUser();
    const userForAdd = {}; // due to 'user' password will be hashed and not valid for sign in

    Object.assign(userForAdd, user);

    await usersService.create(userForAdd);
    signInResult = await service.signIn(user);

    expect(signInResult.user).toBeDefined();
    expect(signInResult.user.email).toEqual(user.email);
  });
});