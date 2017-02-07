class UserService {
    constructor(userRepository, errors) {
        this.userRepository = userRepository;
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
            
            this.userRepository.create(user)
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

    read(id) {
        id = parseInt(id);

        return new Promise((resolve, reject) => {
            if (isNaN(id)) {
                reject(this.errors.invalidId);
                return;
            }

            this.userRepository.findById(id)
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
                .then(data => resolve(this._getReadManyResults(params, data)))
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

    update(user) {
        let u = {
            password: params.password,
            email: params.email,
            firstname: params.firstname,
            lastname: params.lastname
        };
        
        return new Promise((resolve, reject) => {

        });
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.userRepository.destroy({ where: { id } })
                .then(resolve)
                .catch(reject);
        });
    }

    validate(user) {
        let rc = [];

        if (user.email == undefined || user.email == "")
            rc.push("Email not set or not set");
        if (user.password == undefined || user.password == "")
            rc.push("Password not set or not set");
        if (user.firstname == undefined || user.firstname == "")
            rc.push("First not set or name not set");
        if (user.lastname == undefined || user.lastname == "")
            rc.push("Last not set or name not set");

        return rc;
    }
}

module.exports = UserService;
