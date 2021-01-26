module.exports = (sequelize, Sequelize) => {
  const Drops = sequelize.define("drops", {
    dropTitle: {
      type: Sequelize.STRING(100),
      allowNull: false,
      notEmpty: true,
    },
    dropLanguage: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
    },
    visibility: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    dropText: {
      type: Sequelize.TEXT,
      notEmpty: true,
      allowNull: false,
    },
  });
  return Drops;
};
