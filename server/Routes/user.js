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
  const userId = req.params.userId;

  let userModel = await req.app.locals.db.Users.findByPk(userId, {
    attributes: ["id", "username", "description", "numStars", "numForks"],
  });

  //   console.log("User model is", userModel);
  if (userModel === null) {
    res.status(404).end();
    return;
  }

  let userDrops = undefined;
  // If the current user is requesting their profile, return private drops as well
  if (req.user !== undefined && req.user.uid === parseInt(userId)) {
    userDrops = await req.app.locals.db.Drops.findAll({
      where: { userId: userId },
      attributes: ["id", "title", "lang"],
    });
  } else {
    userDrops = await req.app.locals.db.Drops.findAll({
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
  const userId = req.params.userId;
  if (req.user === undefined || req.user.uid !== parseInt(userId)) {
    res.status(401).end();
    return;
  }

  const userModel = await req.app.locals.db.Users.findByPk(userId);

  if (userModel === null) {
    res.status(404).end();
  } else {
    await userModel.destroy();
    req.logout();
    res.status(200).end();
  }
});

module.exports = router;
