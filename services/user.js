class UserService {
    constructor(usersRepository, errors) {
        this.usersRepository = usersRepository;
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

    create(user) {
        let validationErrors = this._getValidationErrors(user);

        return new Promise((resolve, reject) => {
            if (validationErrors.length > 0) {
                reject(validationErrors);
                return;
            }
            
            this.usersRepository.create(user)
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

            this.usersRepository.findById(id)
                .then((user) => {
                    if (user == null) reject(this.errors.notFound);
                    else resolve(user);
                })
                .catch(reject);
        });
    }

    readMany(params) {
        if (!params.page) params.page = 1;
        
        let findOptions = this._getReadManyOptions(params);

        return new Promise((resolve, reject) => {
            this.usersRepository
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

    update(params) {
        let u = {
            email: params.email,
            password: params.password,
            firstname: params.firstname,
            lastname: params.lastname
        };
        let validationErrors = this._getValidationErrors(u);
        
        return new Promise((resolve, reject) => {
            if (validationErrors.length > 0) {
                reject(validationErrors);
                return;
            }

            if (params.id == undefined) {
                reject(this.errors.invalidEntity);
                return;
            }
            
            this.usersRepository.update(u, { where: { id: params.id }, limit: 1 });
        });
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.usersRepository.destroy({ where: { id } })
                .then(resolve)
                .catch(reject);
        });
    }

    _getValidationErrors(user) {
        let validationErrors = this.validate(user).join('; ');

        if (validationErrors.length == 0) return "";

        let rc = this.errors.invalidEntity;
        rc.message = rc.message + ': ' + validationErrors;
        return rc;
    }

    validate(user) {
        let rc = [];

        if (user.email == undefined || user.email == "")
            rc.push('Email not set');
        if (user.password == undefined || user.password == "")
            rc.push('Password not set');
        if (user.firstname == undefined || user.firstname == "")
            rc.push('First name not set');
        if (user.lastname == undefined || user.lastname == "")
            rc.push('Last name not set');

        return rc;
    }
}

module.exports = UserService;
