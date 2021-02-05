const express = require("express");
const router = express.Router();

router.get("/:userId/forks", async (req, res) => {});

router.get("/:userId/stars", async (req, res) => {
  const userId = req.params.userId;

  let starModel = req.app.locals.db.Stars.findAll({
    where: { userId: userId },
  });

  if (starModel === null) {
    res.json([]).status(200);
  } else {
    const starredDrops = starModel.map(async (star) => {
      const dropsModel = req.app.locals.db.Drops.findOne({
        where: { id: star.dataValues.dropId },
        attributes: ["id", "title", "description", "lang"],
      });
      return dropsModel.dataValues;
    });
    res.json(starredDrops).status(200);
  }
});

// Retrieve the profile of a user
router.get("/:userId/profile", async (req, res) => {
  const userId = req.params.userId;

  let userModel = req.app.locals.db.Users.findByPk(userId, {
    attributes: ["id", "username", "description", "numStars", "numForks"],
  });

  if (userModel === null) {
    res.status(404).end();
    return;
  }

  let userDrops = undefined;
  // If the current user is requesting their profile, return private drops as well
  if (req.user.uid === userId) {
    userDrops = req.app.locals.db.Drops.findAll({
      where: { userId: userId },
      attributes: ["id", "title", "lang"],
    });
  } else {
    userDrops = req.app.locals.db.Drops.findAll({
      where: { userId: userId, visibility: true },
      attributes: ["id", "title", "lang"],
    });
  }

  res
    .json({ profile: userModel.dataValues, drops: userDrops || [] })
    .status(200);
});

router.put("/:userId/profile", async (req, res) => {
  const userId = req.params.userId;
});

router.delete("/:userId", async (req, res) => {
  const userId = req.params.userId;
  if (req.user === undefined || req.user.uid !== userId) {
    res.status(401).end();
    return;
  }

  const userModel = req.app.locals.db.Users.findByPk(userId);

  if (userModel === null) {
    res.status(200).end();
  } else {
    userModel.destroy();
    res.status(200).end();
  }
});

module.exports = router;
