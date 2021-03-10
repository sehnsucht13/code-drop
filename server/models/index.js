require("dotenv").config();
const Sequelize = require("sequelize");

let databaseName;

switch (process.env.NODE_ENV) {
  case "test":
    databaseName = process.env.DB_DATABASE_TEST;
    break;
  case "production":
    databaseName = process.env.DB_DATABASE_PROD;
    break;
  case "dev":
    databaseName = process.env.DB_DATABASE_DEV;
    break;

  default:
    break;
}

// Initialize database connection
const sequelize = new Sequelize(
  databaseName,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    protocol: "mariadb",
    dialect: "mariadb",
    logging: false,
  }
);

const Users = require("./user")(sequelize, Sequelize);
const Drops = require("./drops")(sequelize, Sequelize);
const DropAnnotations = require("./dropannotations")(sequelize, Sequelize);
const Comments = require("./comment")(sequelize, Sequelize);
const Stars = require("./stars")(sequelize, Sequelize);

Drops.hasMany(DropAnnotations);
Drops.hasMany(Stars);
Drops.belongsTo(Users);
Drops.belongsTo(Drops, { as: "forkedFrom" });

DropAnnotations.belongsTo(Users);
DropAnnotations.belongsTo(Drops);

Comments.belongsTo(Users);
Comments.belongsTo(Drops);

Stars.belongsTo(Users);
Stars.belongsTo(Drops);

module.exports = {
  sequelize,
  Sequelize,
  Drops,
  DropAnnotations,
  Users,
  Comments,
  Stars,
};
