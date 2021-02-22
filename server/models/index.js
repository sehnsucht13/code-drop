require("dotenv").config();
const Sequelize = require("sequelize");

let sequelize = undefined;
let database_name = undefined;

switch (process.env.NODE_ENV) {
  case "test":
    database_name = process.env.DB_DATABASE_TEST;
    break;
  case "production":
    database_name = process.env.DB_DATABASE_PROD;
    break;
  case "dev":
    database_name = process.env.DB_DATABASE_DEV;
    break;

  default:
    break;
}

// Initialize database connection
sequelize = new Sequelize(
  "code_drops_test",
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
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

DropAnnotations.belongsTo(Users);
DropAnnotations.belongsTo(Drops);

Comments.belongsTo(Users);
Comments.belongsTo(Drops);

Stars.belongsTo(Users);
Stars.belongsTo(Drops);

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  Drops: Drops,
  DropAnnotations: DropAnnotations,
  Users: Users,
  Comments: Comments,
  Stars: Stars,
};
