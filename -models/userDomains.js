 function UserDomains(Sequelize, sequelize) {
    return sequelize.define('userdomains', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: Sequelize.INTEGER,
        domainId: Sequelize.INTEGER
    });
};

module.exports = UserDomains;
