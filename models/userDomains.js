 function UserDomains(Sequelize, sequelize) {
    return sequelize.define('userdomains', {
        ownedOn: Sequelize.DATE
    });
};

module.exports = UserDomains;
