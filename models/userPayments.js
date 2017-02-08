 function Payment(Sequelize, sequelize) {
    return sequelize.define('payments', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: Sequelize.INTEGER,
        domainId: Sequelize.INTEGER,
        sum: Sequelize.FLOAT
    });
};

module.exports = Payment;
