const Sequelize = require('sequelize');

const connection = new Sequelize('...','...','...', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

module.exports = connection;
