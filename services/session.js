class SessionService {
    constructor(usersRepository, jwt, config, errors) {
        this.usersRepository = usersRepository;
        this.jwt = jwt;
        this.config = config;
        this.errors = errors;
    }

    signIn(u) {
        let isUserDefinedGood = u != undefined && u.email != undefined;

        return new Promise((resolve, reject) => {
            if (!isUserDefinedGood) { reject(this.errors.invalidEntity); return; }

            this.usersRepository.findOne( { where: { email: u.email } })
                .then((user) => {
                    if (user == null) { reject(this.errors.wrongCredentials); return; }

                    let dbPassword = this.jwt.verify(user.dataValues.password, this.config.jwt.secret);

                    if (dbPassword !== u.password) { reject(this.errors.wrongCredentials); }
                    else { resolve(user.dataValues.id); }
                })
                .catch(reject);
        });
    }
}

module.exports = SessionService;
