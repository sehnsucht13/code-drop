module.exports = (sequelize, Sequelize) => {
  const Drops = sequelize.define("drops", {
    title: {
      type: Sequelize.STRING(100),
      allowNull: false,
      notEmpty: true,
    },
    lang: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
    },
    visibility: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    isForked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    text: {
      type: Sequelize.TEXT,
      notEmpty: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      notEmpty: true,
      allowNull: false,
    },
  });
  return Drops;
};
