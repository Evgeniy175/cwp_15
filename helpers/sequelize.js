function DbContext(Sequelize, config) {
    let options = {
      host: config.db.host,
      dialect: 'mysql',
      logging: false,
      define: {
        timestamps: true,
        paranoid: true
      }
    };

    const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pass, options);

    const Users = require('../models/user')(Sequelize, sequelize);
    const Domains = require('../models/domain')(Sequelize, sequelize);
    const UserDomains = require('../models/userDomains')(Sequelize, sequelize);
    const UserPayments = require('../models/userPayments')(Sequelize, sequelize);

    Users.belongsToMany(Domains, { through: UserPayments });

    return {
      users: Users,
      domains: Domains,
      userPayments: UserPayments,
      
      sequelize: sequelize
    }
}

module.exports = DbContext;
