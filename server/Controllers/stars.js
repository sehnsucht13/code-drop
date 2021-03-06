const { isInt } = require("./helpers");

const deleteStar = async (req, res) => {
  if (!isInt(req.params.dropId)) {
    res.status(400).end();
  } else if (req.user === undefined) {
    res.status(401).end();
    return;
  }

  const dropId = parseInt(req.params.dropId, 10);

  try {
    const starInstance = await req.app.locals.db.Stars.findOne({
      where: { userId: req.user.uid, dropId },
    });
    console.log("Star instance", starInstance);
    if (starInstance === null) {
      res.status(404).end();
      return;
    }
    await starInstance.destroy();

    const userInstance = await req.app.locals.db.Users.findByPk(dropId);
    if (userInstance !== null) {
      userInstance.numStars -= 1;
      await userInstance.save();
    }
    res.status(200).end();
  } catch (err) {
    console.error("Have an unexpected error deleting a star", err);
    res.status(500).end();
  }
};

const createStar = async (req, res) => {
  if (req.user === undefined) {
    res.status(401).end();
    return;
  }
  if (!isInt(req.params.dropId)) {
    res.status(400).end();
    return;
  }
  const dropId = parseInt(req.params.dropId, 10);

  try {
    const dropRecordInstance = await req.app.locals.db.Drops.findByPk(dropId);

    if (dropRecordInstance === null) {
      res.status(404).end();
      return;
    }

    const userInstance = await req.app.locals.db.Users.findByPk(dropId);
    if (userInstance !== null) {
      userInstance.numStars += 1;
      await userInstance.save();
    }

    const newStarInstance = await req.app.locals.db.Stars.create({
      dropId,
      userId: req.user.uid,
    });
    if (newStarInstance === null) {
      res.status(500).end();
      return;
    }
    res.status(200).end();
  } catch (err) {
    console.error("Have an unexpected error creating a star", err);
    res.status(500).end();
  }
};

module.exports = {
  deleteStar,
  createStar,
};
