const TestsBase = require('../base');

const Request = require('request');
const BCrypt = require('bcryptjs');

const Errors = require('../../helpers/errors');

const CONFIG_PATH = process.env.NODE_ENV === 'production' ? '../../config' : '../../config-dev';
const Config = require(CONFIG_PATH);

const BaseRepository = require('../mocks/repositories/base');
const UsersRepository = require('../mocks/repositories/users');

const domainsRepo = new BaseRepository();
const usersRepo = new UsersRepository(domainsRepo);
const userDomainsRepository = new BaseRepository();

const DomainService = require('../../services/domain');
const service = new DomainService(Request, domainsRepo, usersRepo, userDomainsRepository, Config, Errors);

const UserService = require('../../services/user');
const userService = new UserService(usersRepo, BCrypt, Config, Errors);

describe('Tests domains service', async () => {
  beforeEach(() => {
    domainsRepo.mockClear();
    usersRepo.mockClear();
    userDomainsRepository.mockClear();
  });

  it('>> buy test', async () => {
    const user = TestsBase.generateUser();
    await userService.create(user);
    
    const domain = TestsBase.generateDomain();
    const buyedDomain = await service.buy(user.id, domain.name);
    
    expect(buyedDomain.id).toBeDefined();
  });

  it('>> read test', async () => {
    const user = TestsBase.generateUser();
    await userService.create(user);
    
    const domain = TestsBase.generateDomain();
    const buyedDomain = await service.buy(user.id, domain.name);

    const readedDomain = await service.read(buyedDomain.id);
    
    expect(readedDomain).toEqual(buyedDomain);
  });

  it('>> read many test', async () => {
    const domains = [];

    const user = TestsBase.generateUser();
    await userService.create(user);

    for (let i = 0; i < 3; i++) {
      const domain = TestsBase.generateDomain();
      const buyed = await service.buy(user.id, domain.name);
      domain.id = buyed.id;
      domains.push(domain);
    }

    const readResult = await service.readMany({ params: { limit: 100 } });
    
    readResult.rows.forEach(row => {
      let isFound = domains.some(domain => domain.id == row.id && domain.name == row.name);
      expect(isFound).toBeTruthy();
    });
  });

  it('>> update test', async () => {
    const user = TestsBase.generateUser();
    await userService.create(user);

    const domain = TestsBase.generateDomain();
    const buyedDomain = await service.buy(user.id, domain.name);

    const newDomain = TestsBase.generateDomain();
    const updateResult = await service.update(buyedDomain.id, newDomain);

    const readResult = await service.read(buyedDomain.id);
    const isDomainUpdated = isDomainsEquals(updateResult.domain, readResult);

    expect(isDomainUpdated).toBeTruthy();
  });

  function isDomainsEquals(d1, d2) {
    return d1.id == d2.id && d1.name == d2.name;
  }

  it('>> remove test', async () => {
    let isDeleteErrorThrowed = false;

    const user = TestsBase.generateUser();
    await userService.create(user);
    
    const domain = TestsBase.generateDomain();
    const buyedDomain = await service.buy(user.id, domain.name);

    const deleteResult = await service.remove(buyedDomain.id);

    try {
      await service.read(buyedDomain.id);
    }
    catch(err) {
      expect(err).toBe(Errors.notFound);
      isDeleteErrorThrowed = true;
    }

    expect(isDeleteErrorThrowed).toBeTruthy();
  });
});