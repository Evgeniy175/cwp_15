const TestsBase = require('../base');

const BCrypt = require('bcryptjs');
const Errors = require('../../helpers/errors');

const CONFIG_PATH = process.env.NODE_ENV === 'production' ? '../../config' : '../../config-dev';
const Config = require(CONFIG_PATH);

const UsersRepository = require('../mocks/repositories/users');
const usersRepo = new UsersRepository();

const UserService = require('../../services/user');
const service = new UserService(usersRepo, BCrypt, Config, Errors);

describe('Tests users service', async () => {
  beforeEach(() => usersRepo.mockClear());

  it('>> create test', async () => {
    const user = TestsBase.generateUser();
    await service.create(user);
    const readResult = await service.read(user.id);
    expect(readResult).toBeDefined();
  });

  it('>> read test', async () => {
    const user = TestsBase.generateUser();
    await service.create(user);
    const readResult = await service.read(user.id);
    expect(readResult).toEqual(user);
  });

  it('>> read many test', async () => {
    const users = [];

    for (let i = 0; i < 20; i++) {
      const user = TestsBase.generateUser();
      users.push(user);
      await service.create(user);
    }

    const readResult = await service.readMany({ params: { limit: 100 } });
    const isContains = readResult.rows.every(row => users.includes(row));
    
    expect(isContains).toBeTruthy();
  });

  it('>> update test', async () => {
    const user = TestsBase.generateUser();
    await service.create(user);

    const updatedUser = TestsBase.generateUser();
    await service.update(user.id, updatedUser);

    const readResult = await service.read(user.id);
    const isUserUpdated = isUsersEquals(updatedUser, readResult);
    expect(isUserUpdated).toBeTruthy();
  });

  function isUsersEquals(u1, u2) {
    return u1.email == u2.email
        && BCrypt.compareSync(u1.password, u2.password)
        && u1.firstname == u2.firstname
        && u1.lastname == u2.lastname;
  }

  it('>> remove test', async () => {
    let isDeleteErrorThrowed = false;

    const user = TestsBase.generateUser();
    await service.create(user);
    
    const deleteResult = await service.remove(user.id);
    
    try {
      await service.read(user.id);
    }
    catch(err) {
      expect(err).toBe(Errors.notFound);
      isDeleteErrorThrowed = true;
    }

    expect(isDeleteErrorThrowed).toBeTruthy();
  });
});
