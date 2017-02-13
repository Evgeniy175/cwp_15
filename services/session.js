class SessionService {
    constructor(usersRepository, bcrypt, config, errors) {
        this.usersRepository = usersRepository;
        this.bcrypt = bcrypt;
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

                    if (this.bcrypt.compareSync(u.password, user.dataValues.password)) { resolve(user.dataValues.id); }
                    else { reject(this.errors.wrongCredentials); }
                })
                .catch(reject);
        });
    }
}

module.exports = SessionService;
