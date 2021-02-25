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
      type: Sequelize.STRING(200),
      notEmpty: true,
      allowNull: false,
    },
    numForks: {
      type: Sequelize.INTEGER,
      notEmpty: true,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  });
  return Drops;
};
