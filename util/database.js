const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '!Qa2ws3e', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
