const Sequelize = require('sequelize');
const database = require('./database');

const Users = database.define('users', {
  twitterName: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  nemAddress: Sequelize.STRING,
  symbolAddress: Sequelize.STRING
});

module.exports = Users
