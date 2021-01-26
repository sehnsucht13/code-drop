const Sequelize = require("sequelize");

module.exports = (sequelize, Sequelize2) => {
  const DropAnnotation = sequelize.define("drop_annotation", {
    startLine: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    endLine: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    annotation_text: {
      type: Sequelize.TEXT,
      allowNull: false,
      notEmpty: true,
    },
  });
  return DropAnnotation;
};
