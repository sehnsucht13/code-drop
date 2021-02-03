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

const Drops = require("./drops")(sequelize, Sequelize);
const DropAnnotations = require("./dropannotations")(sequelize, Sequelize);
const Users = require("./user")(sequelize, Sequelize);

Drops.hasMany(DropAnnotations);
// Drops.hasOne(Users);

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  Drops: Drops,
  DropAnnotations: DropAnnotations,
  Users: Users,
};
