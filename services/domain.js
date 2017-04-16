const Promise = require('bluebird');

class DomainService {
  constructor(request, domainRepository, userRepository, userDomainsRepository, config, errors) {
    this.request = request;
    this.domainRepository = domainRepository;
    this.userRepository = userRepository;
    this.userDomainsRepository = userDomainsRepository;
    this.config = config;
    this.errors = errors;

    this.defaultOptions = {
      readMany: {
        limit: 10,
        page: 1,
        order: 'asc',
        orderField: 'id'
      }
    };
  }

  read(id) {
    id = parseInt(id);

    return new Promise((resolve, reject) => {
      if (isNaN(id)) {
        reject(this.errors.invalidId);
        return;
      }

      this.domainRepository.findById(id)
      .then((domain) => {
        if (domain == null) reject(this.errors.notFound);
        else resolve(domain.dataValues);
      })
      .catch(reject);
    });
  }

  readMany(params) {
    if (!params.page) params.page = 1;
    
    let findOptions = this._getReadManyOptions(params);

    return new Promise((resolve, reject) => {
      this.domainRepository
      .findAndCountAll(findOptions)
      .then(data => resolve(this._getReadManyResults(params, findOptions, data)))
      .catch(reject);
    });
  }

  _getReadManyOptions(params) {
    params = Object.assign({}, this.defaultOptions.readMany, params)

    let limit = parseInt(params.limit);
    let page = parseInt(params.page);

    return {
      limit: limit,
      offset: (page - 1) * limit,
      order: [[params.orderField, params.order.toUpperCase()]],
      raw: true
    };
  }

  _getReadManyResults(params, findOptions, data) {
    return {
      portionNumber: params.page,
      nOfPortions: Math.ceil(data.count / findOptions.limit),
      rows: data.rows
    };
  }

  update(id, params) {
    let d = { name: params.name };
    let validationErrors = this._getValidationErrors(d);
    
    return new Promise((resolve, reject) => {
      if (validationErrors.length > 0) {
        reject(validationErrors);
        return;
      }

      if (id == undefined) {
        reject(this.errors.invalidEntity);
        return;
      }
      
      return this.domainRepository.update(d, { where: { id }, limit: 1 })
      .then(data => {resolve({domain: d, action: 'update', success: true});})
      .catch(reject);
    });
  }

  remove(id) {
    return new Promise((resolve, reject) => {
      this.domainRepository.destroy({ where: { id } })
      .then(data => resolve({domainId: id, action: 'delete', success: true}))
      .catch(reject);
    });
  }

  isAvailable(domain) {
    let isDomainGood = domain != undefined && domain.length > 0;
    let options = {
      url: 'https://api.domainr.com/v2/status?domain=' + domain + '&client_id=' + this.config.domainRequest.key,
      headers: {
        Origin: 'https://www.namecheap.com'
      }
    };

    return new Promise((resolve, reject) => {
      if (!isDomainGood) reject(this.errors.badDomain);

      this.request(options, (err, response, body) => {
        if (err) {reject(this.errors.noConnection); return;}

        let result = JSON.parse(response.body);
        
        if (result.errors) {reject(this.errors.badDomain); return;}
        if (!result.status) {reject(this.errors.badRequest); return;}
        
        const isAvailable = result.status[0].status != 'active';
        resolve({domain, isAvailable: isAvailable});
      });
    });
  }

  buy(userId, domain) {
    return new Promise((resolve, reject) => {
      if (userId == undefined) { reject(this.errors.invalidId); return; }
      if (domain == undefined || domain == '') { reject(this.errors.badDomain); return; }

      let validationErrors = this._getValidationErrors(domain);

      if (validationErrors.length > 0) { reject(validationErrors); return; }

      return this.userRepository.findById(userId)
      .then((user) => {
        if (user == undefined) { reject(this.errors.invalidId); }
        else { return this._tryAddUserDomain(user, domain); }
      })
      .then(data => resolve(data.dataValues))
      .catch(reject);
    });
  }

  _tryAddUserDomain(user, domain) {
    let isAvailableRemote = this.isAvailable(domain);
    let isAvailableLocal = this.domainRepository.find({ where: { name: domain } });
    
    return Promise.all([isAvailableRemote, isAvailableLocal])
    .spread((remote, local) => {
      if (!remote.isAvailable || (local && local.dataValues && local.dataValues.length > 0)) Promise.reject(this.errors.domainNotAvailable);
      return user.createDomain({ name: domain });
    })
    .catch(err => err);
  }

  _getValidationErrors(domain) {
    let validationErrors = this.validate(domain).join('; ');

    if (validationErrors.length == 0) return "";

    let rc = this.errors.invalidEntity;
    rc.message = rc.message + ': ' + validationErrors;
    return rc;
  }

  validate(domain) {
    let rc = [];

    if (domain.name == undefined || domain.name == "") rc.push('Domain name not set');

    return rc;
  }
}

module.exports = DomainService;
