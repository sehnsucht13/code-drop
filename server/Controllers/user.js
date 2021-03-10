const util = require("util");
const fs = require("fs");
const sharp = require("sharp");
const { isInt, uploadFile, deleteFile } = require("./helpers");

const unlinkFile = util.promisify(fs.unlink);

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
      attributes: [
        "id",
        "username",
        "description",
        "avatar",
        "numStars",
        "numForks",
      ],
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
  } else if (
    req.body.description === undefined ||
    req.body.description.length === 0
  ) {
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

const updateAvatar = async (req, res) => {
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
  const uploadedFile = req.file;
  console.log("File", uploadedFile);

  try {
    if (
      uploadedFile.mimetype !== "image/png" &&
      uploadedFile.mimetype !== "image/jpg" &&
      uploadedFile.mimetype !== "image/jpeg"
    ) {
      await unlinkFile(uploadedFile.path);
      res.status(400).end();
      return;
    }

    const userInstance = await req.app.locals.db.Users.findByPk(userId);
    if (userInstance === null) {
      res.status(404).end();
      return;
    }

    const resizedAvatarFilePath = `${uploadedFile.path}.${
      uploadedFile.mimetype.split("/")[1]
    }`;
    const resizedAvatarFileName = `${uploadedFile.filename}.${
      uploadedFile.mimetype.split("/")[1]
    }`;

    await sharp(uploadedFile.path)
      .resize(400, 500, { fit: "fill" })
      .png()
      .toFile(resizedAvatarFilePath);
    await unlinkFile(uploadedFile.path);
    const result = await uploadFile(
      resizedAvatarFilePath,
      resizedAvatarFileName
    );
    if (result !== null) {
      if (userInstance.dataValues.avatarKey !== null) {
        await deleteFile(userInstance.dataValues.avatarKey);
      }
      await unlinkFile(resizedAvatarFilePath);
      // Update values for new avatar
      userInstance.avatar = result.Location;
      userInstance.avatarKey = result.Key;
      await userInstance.save();

      res.send({ avatarURL: result.Location });
      return;
    }
    res.status(400).end();
    // res.status(200).end();
  } catch {
    res.status(500).end();
  }
};

module.exports = {
  deleteUser,
  updateUserProfile,
  getUserProfile,
  getUserStars,
  updateAvatar,
};
