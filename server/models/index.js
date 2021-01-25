require("dotenv").config();
const Sequelize = require("sequelize");

// Initialize database connection
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mariadb",
  }
);

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
};
