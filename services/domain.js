class DomainService {
    constructor(domainRepository, errors) {
        this.domainRepository = domainRepository;
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

    create(domain) {
        return new Promise((resolve, reject) => {
            this.domainRepository.create(domain)
                .then(resolve)
                .catch(reject);
        });
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
                    else resolve(domain);
                })
                .catch(reject);
        });
    }

    readMany(params) {
        if (!params.page) params.page = 1;
        
        let findOptions = _getReadManyOptions(params);

        return new Promise((resolve, reject) => {
            this.domainRepository
                .findAndCountAll(findOptions)
                .then(data => resolve(_getReadManyResults(params, data)))
                .catch(reject);
        });
    }

    _getReadManyOptions(params) {
        params = Object.assign({}, defaultOptions.readMany, params)

        let limit = parseInt(params.limit);
        let page = parseInt(params.page);

        return {
            limit: limit,
            offset: (page - 1) * limit,
            order: [[params.orderField, params.order.toUpperCase()]],
            raw: true
        };
    }

    _getReadManyResults(params, data) {
        return {
            portionNumber: params.page,
            nOfPortions: Math.ceil(data.count / findOptions.limit),
            rows: data.rows
        };
    }

    update(params) {
        let d = {
            name: params.name
        };
        let validationErrors = this._getValidationErrors(d);
        
        return new Promise((resolve, reject) => {
            if (validationErrors.length > 0) {
                reject(validationErrors);
                return;
            }

            if (params.id == undefined) {
                reject(this.errors.invalidEntity);
                return;
            }
            
            this.domainRepository.update(u, { where: { id: params.id }, limit: 1 });
        });
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.domainRepository.destroy({ where: { id } })
                .then(resolve)
                .catch(reject);
        });
    }

    isAcceptable(domain) {
        // todo
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

        if (domain.name == undefined || domain.name == "")
            rc.push('Domain name not set');

        return rc;
    }
}

module.exports = DomainService;
