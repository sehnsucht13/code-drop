const express = require("express");
const router = express.Router();

// TODO: Finish route
router.get("/:userId/forks", async (req, res) => {});

router.get("/:userId/stars", async (req, res) => {
  const userId = req.params.userId;

  let starModel = await req.app.locals.db.Stars.findAll({
    where: { userId: userId },
  });

  if (starModel === null) {
    res.status(200).json([]);
  } else {
    const starredDrops = starModel.map(async (star) => {
      const dropsModel = await req.app.locals.db.Drops.findOne({
        where: { id: star.dataValues.dropId },
        attributes: ["id", "title", "description", "lang"],
      });
      return dropsModel.dataValues;
    });
    res.status(200).json(starredDrops);
  }
});

// Retrieve the profile of a user
router.get("/:userId/profile", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).end();
    return;
  }

  try {
    let userModel = await req.app.locals.db.Users.findByPk(userId, {
      attributes: ["id", "username", "description", "numStars", "numForks"],
    });

    //   console.log("User model is", userModel);
    if (userModel === null) {
      res.status(404).end();
      return;
    }

    let userDrops = undefined;
    let languageCount = undefined;

    // If the current user is requesting their profile, return private drops as well
    if (req.user !== undefined && req.user.uid === userId) {
      userDrops = await req.app.locals.db.Drops.findAll({
        where: { userId: userId },
        attributes: ["id", "title", "lang", "userId"],
      });

      languageCount = await req.app.locals.db.Drops.findAll({
        where: { userId: userId },
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
        where: { userId: userId, visibility: true },
        attributes: ["id", "title", "lang", "userId"],
      });

      languageCount = await req.app.locals.db.Drops.findAll({
        where: { userId: userId, visibility: true },
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
      profile: userModel.dataValues,
      drops: userDrops || [],
      counts: languageCount || [],
    });
  } catch (err) {
    console.log("Error", err);
    res.status(500).end();
  }
});

router.put("/:userId/profile", async (req, res) => {
  const userId = req.params.userId;
  const description = req.body.description;
  if (req.user === undefined || req.user.uid !== parseInt(userId)) {
    res.status(401).end();
    return;
  }

  if (description === undefined) {
    res.status(400).end();
    return;
  }

  const userModel = await req.app.locals.db.Users.findByPk(userId);
  if (userModel === null) {
    res.status(404).end();
  } else {
    userModel.description = description;
    await userModel.save();
    res.status(200).end();
  }
});

router.delete("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).end();
    return;
  } else if (req.user === undefined || req.user.uid !== userId) {
    res.status(401).end();
    return;
  }

  try {
    const userModel = await req.app.locals.db.Users.findByPk(userId);

    if (userModel === null) {
      res.status(404).end();
    } else {
      await userModel.destroy();
      req.logout();
      res.status(200).end();
    }
  } catch {
    res.status(500).end();
  }
});

module.exports = router;
