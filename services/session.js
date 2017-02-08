class SessionService {
    constructor(usersRepository, errors) {
        this.usersRepository = usersRepository;
        this.errors = errors;
    }

    signIn(u) {
        let isUserDefinedGood = u != undefined && u.email != undefined;

        return new Promise((resolve, reject) => {
            if (!isUserDefinedGood) {
                reject(this.errors.invalidEntity)
                return;
            }

            this.usersRepository.findOne( { where: { email: u.email } })
                .then((user) => {
                    if (user == null || user.password != u.password) {
                        res.cookie(config.cookie.authKey, config.cookie.authValue);
                        reject(this.errors.wrongCredentials);
                    } else {
                        resolve(user.dataValues.id);
                    }
                })
                .catch(reject);
        });
    }
}

module.exports = SessionService;
