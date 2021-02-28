const { isInt } = require("./helpers");

const getUserStars = async (req, res) => {
  if (!isInt(req.params.userId)) {
    res.status(400).end();
    return;
  }
  const { userId } = req.params;

  const starInstance = await req.app.locals.db.Stars.findAll({
    where: { userId },
  });

  if (starInstance === null) {
    res.status(200).json([]);
  } else {
    const starredDropsInstances = starInstance.map(async (star) => {
      const dropInstance = await req.app.locals.db.Drops.findOne({
        where: { id: star.dataValues.dropId },
        attributes: ["id", "title", "description", "lang"],
      });
      return dropInstance.dataValues;
    });
    res.status(200).json(starredDropsInstances);
  }
};

const getUserProfile = async (req, res) => {
  if (!isInt(req.params.userId)) {
    res.status(400).end();
    return;
  }
  const userId = parseInt(req.params.userId, 10);

  try {
    const userInstance = await req.app.locals.db.Users.findByPk(userId, {
      attributes: ["id", "username", "description", "numStars", "numForks"],
    });

    //   console.log("User model is", userModel);
    if (userInstance === null) {
      res.status(404).end();
      return;
    }

    let userDrops;
    let languageCount;

    // If the current user is requesting their profile, return private drops as well
    if (req.user !== undefined && req.user.uid === userId) {
      userDrops = await req.app.locals.db.Drops.findAll({
        where: { userId },
        attributes: ["id", "title", "lang", "userId"],
      });

      languageCount = await req.app.locals.db.Drops.findAll({
        where: { userId },
        group: ["drops.lang"],
        attributes: [
          "lang",
          [
            req.app.locals.db.sequelize.fn(
              "count",
              req.app.locals.db.sequelize.col("lang")
            ),
            "count",
          ],
        ],
      });
    } else {
      userDrops = await req.app.locals.db.Drops.findAll({
        where: { userId, visibility: true },
        attributes: ["id", "title", "lang", "userId"],
      });

      languageCount = await req.app.locals.db.Drops.findAll({
        where: { userId, visibility: true },
        group: ["drops.lang"],
        attributes: [
          "lang",
          [
            req.app.locals.db.sequelize.fn(
              "count",
              req.app.locals.db.sequelize.col("lang")
            ),
            "count",
          ],
        ],
      });
    }
    res.status(200).json({
      profile: userInstance.dataValues,
      drops: userDrops || [],
      counts: languageCount || [],
    });
  } catch (err) {
    res.status(500).end();
  }
};

const updateUserProfile = async (req, res) => {
  if (!isInt(req.params.userId)) {
    res.status(400).end();
  } else if (
    req.user === undefined ||
    req.user.uid !== parseInt(req.params.userId, 10)
  ) {
    res.status(401).end();
    return;
  } else if (req.body.description === undefined) {
    res.status(400).end();
    return;
  }
  const { userId } = req.params;
  const { description } = req.body;

  const userInstance = await req.app.locals.db.Users.findByPk(userId);
  if (userInstance === null) {
    res.status(404).end();
  } else {
    userInstance.description = description;
    await userInstance.save();
    res.status(200).end();
  }
};

const deleteUser = async (req, res) => {
  if (!isInt(req.params.userId)) {
    res.status(400).end();
    return;
  }
  if (
    req.user === undefined ||
    req.user.uid !== parseInt(req.params.userId, 10)
  ) {
    res.status(401).end();
    return;
  }

  const userId = parseInt(req.params.userId, 10);
  try {
    const userInstance = await req.app.locals.db.Users.findByPk(userId);

    if (userInstance === null) {
      res.status(404).end();
    } else {
      await userInstance.destroy();
      req.logout();
      res.status(200).end();
    }
  } catch {
    res.status(500).end();
  }
};

module.exports = {
  deleteUser,
  updateUserProfile,
  getUserProfile,
  getUserStars,
};
