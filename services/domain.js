class DomainService {
    constructor(domenRepository, errors) {
        this.domenRepository = domenRepository;
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

    create(domen) {
        return new Promise((resolve, reject) => {
            this.domenRepository.create(domen)
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

            this.domenRepository.findById(id)
                .then((domen) => {
                    if (domen == null) reject(this.errors.notFound);
                    else resolve(domen);
                })
                .catch(reject);
        });
    }

    readMany(params) {
        if (!params.page) params.page = 1;
        
        let findOptions = _getReadManyOptions(params);

        return new Promise((resolve, reject) => {
            this.domenRepository
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

    update(domen) {

    }

    remove(id) {

    }
}

module.exports = DomainService;
