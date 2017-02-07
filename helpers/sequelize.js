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
    const UserDomain = require('../models/userDomains')(Sequelize, sequelize);

    Users.belongsToMany(Domains, { through: UserDomain });

    return {
      users: Users,
      domains: Domains,
      
      sequelize: sequelize
    }
}

module.exports = DbContext;
