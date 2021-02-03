module.exports = (sequelize, Sequelize) => {
  const Drops = sequelize.define("user", {
    username: {
      type: Sequelize.STRING(20),
      allowNull: false,
      notEmpty: true,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
    },
    description: {
      type: Sequelize.TEXT,
      defaultValue: "",
      notEmpty: false,
      allowNull: false,
    },
    numStars: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    numForks: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  });
  return Drops;
};
