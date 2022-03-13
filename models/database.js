const { Sequelize } = require('sequelize');
console.log('process.env.TWITTER_APP_KEY :>> ', process.env.SQLITE_USERNAME);
const database = new Sequelize(
  'users',
  process.env.SQLITE_USERNAME,
  process.env.SQLITE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './database.sqlite'
  }
);

database.sync()

module.exports = database;
