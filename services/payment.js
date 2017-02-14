class PaymentService {
    constructor(request, userDomainsRepository, userPaymentsRepository, config, errors) {
        this.request = request;
        this.userDomainsRepository = userDomainsRepository;
        this.userPaymentsRepository = userPaymentsRepository;
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

    readAllUserPaymentsForDomain(userId, domainId) {
        return new Promise((resolve, reject) => {
            if (userId == null || userId == undefined) reject(this.errors.invalidId);

            this.userDomainsRepository.findOne({where: {userId}})
                .then(rows => {
                    rows.getPayments()
                        .then(p => resolve(p));
                })
                .catch(reject);
        });
    }

    pay(userId, domainId, sum) {
        let validationErrors = this._getPaymentValidationErrors(userId, domainId, sum);

        return new Promise((resolve, reject) => {
            if (validationErrors != "") { reject(validationErrors); }
            else {
                this._tryAddUserPayment(userId, domainId, sum)
                    .then(resolve)
                    .catch(reject);
            }
        });
    }

    _tryAddUserPayment(userId, domainId, sum) {
        return new Promise ((resolve, reject) => {
            this.userDomainsRepository.find({ where: { userId, domainId } })
                .then((ud) => {
                    if (ud == null) { reject(this.errors.badUserDomain); }

                    this.userPaymentsRepository.create({ userDomainId: ud.dataValues.id, sum });
                })
                .then(resolve)
                .catch(reject);
        });
    }

    _getPaymentValidationErrors(userId, domainId, sum) {
        let validationErrors = this._validatePayment(userId, domainId, sum).join('; ');

        if (validationErrors.length == 0) return "";

        let rc = this.errors.invalidEntity;
        rc.message = rc.message + ': ' + validationErrors;
        return rc;
    }

    _validatePayment(userId, domainId, sum) {
        let rc = [];

        if (userId == undefined || userId == "") rc.push("User not set");
        if (domainId == undefined || domainId == "") rc.push("Domain not set");
        if (sum == undefined || isNaN(sum) || sum <= 0) rc.push("Sum incorrect");

        return rc;
    }
}

module.exports = PaymentService;
