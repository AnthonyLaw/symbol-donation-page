const { Sequelize } = require('sequelize');
const database = new Sequelize(
  'users',
  process.env.SQLITE_USERNAME,
  process.env.SQLITE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './data/database.sqlite3'
  }
);

database.sync()

module.exports = database;
