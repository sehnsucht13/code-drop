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
      defaultValue: "User has not written a description.",
      notEmpty: false,
      allowNull: false,
    },
    avatar: {
      type: Sequelize.TEXT,
      defaultValue:
        "https://code-drop-avatars.s3.amazonaws.com/Default_Avatar.png",
      notEmpty: false,
      allowNull: false,
    },
    avatarKey: {
      type: Sequelize.TEXT,
      defaultValue: null,
      notEmpty: false,
      allowNull: true,
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
