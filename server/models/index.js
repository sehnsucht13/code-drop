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

const Users = require("./user")(sequelize, Sequelize);
const Drops = require("./drops")(sequelize, Sequelize);
const DropAnnotations = require("./dropannotations")(sequelize, Sequelize);
const Comments = require("./comment")(sequelize, Sequelize);
const Stars = require("./stars")(sequelize, Sequelize);

Drops.hasMany(DropAnnotations);
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
