 function User(Sequelize, sequelize) {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: Sequelize.STRING,
        password: Sequelize.STRING,
        firstname: Sequelize.STRING,
        lastname: Sequelize.STRING
    });
};

module.exports = User;
