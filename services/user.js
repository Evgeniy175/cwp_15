class UserService {
    constructor(usersRepository, bcrypt, config, errors) {
        this.usersRepository = usersRepository;
        this.bcrypt = bcrypt;
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

    create(user) {
        let validationErrors = this._getValidationErrors(user);

        return new Promise((resolve, reject) => {
            if (validationErrors != "") {
                reject(validationErrors);
                return;
            }

            this._encodeUserPassword(user);
            
            this.usersRepository.create(user)
                .then(data => resolve({success: true}))
                .catch(reject);
        });
    }

    _encodeUserPassword(user) {
        let salt = this.bcrypt.genSaltSync(10);
        user.password = this.bcrypt.hashSync(user.password, salt);
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
                    else resolve(user.dataValues);
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

    update(id, params) {
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

            if (id == undefined) {
                reject(this.errors.invalidEntity);
                return;
            }
            
            this._encodeUserPassword(u);

            return this.usersRepository.update(u, { where: { id }, limit: 1 })
                .then(data => resolve({success:true}))
                .catch(reject);
        });
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.usersRepository.destroy({ where: { id } })
                .then(data => resolve({success:true}))
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

        if (user == undefined) return ["Please, send user data"];

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
