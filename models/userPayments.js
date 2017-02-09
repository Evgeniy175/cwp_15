 function Payment(Sequelize, sequelize) {
    return sequelize.define('userpayments', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userDomainId: Sequelize.INTEGER,
        sum: Sequelize.FLOAT
    });
};

module.exports = Payment;
