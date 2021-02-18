const express = require("express");
const router = express.Router();

// Perform a paginated search
router.get("/paginate", async (req, res) => {
  // TODO: Use try/catch here to turn params into int in case it fails.
  const pageStart = parseInt(req.query.start || 0);
  const pageLimit = parseInt(req.query.count || 15);

  if (isNaN(pageStart) || isNaN(pageLimit)) {
    res.status(400).end();
    return;
  }

  let rows;
  if (req.user !== undefined) {
    rows = await req.app.locals.db.Drops.findAll({
      offset: pageStart,
      limit: pageLimit,
      where: { visibility: 1 },
      order: [["updatedAt", "DESC"]],
      attributes: ["id", "title", "description", "lang", "updatedAt"],
      include: [
        {
          model: req.app.locals.db.Stars,
          where: { userId: req.user.uid },
          required: false,
        },
      ],
    });
  } else {
    rows = await req.app.locals.db.Drops.findAll({
      offset: pageStart,
      limit: pageLimit,
      where: { visibility: 1 },
      order: [["updatedAt", "DESC"]],
      attributes: ["id", "title", "description", "lang", "updatedAt"],
    });
  }
  console.log("Rows from paginate are", rows);
  const response = await Promise.all(
    rows.map(async (row) => {
      if (req.user !== undefined) {
        const rowData = { ...row.dataValues };
        rowData.isStarred = row.dataValues.stars.length === 0 ? false : true;
        delete rowData.stars;

        const starCount = await req.app.locals.db.Stars.count({
          where: { dropId: rowData.id },
        });
        rowData.starCount = starCount;
        return rowData;
      } else {
        const starCount = await req.app.locals.db.Stars.count({
          where: { dropId: row.dataValues.id },
        });
        return { ...row.dataValues, isStarred: false, starCount: starCount };
      }
    })
  );

  res.status(200).json(response);
});

// Retrieve all the comments for a drop if they exist.
router.get("/:dropId/comments", async (req, res) => {
  const dropId = parseInt(req.params.dropId);
  if (isNaN(dropId)) {
    res.status(400).end();
    return;
  }

  const comments = await req.app.locals.db.Comments.findAll({
    where: { dropId: dropId },
    attributes: ["id", "text", "updatedAt", "userId"],
  });

  if (comments !== null) {
    const filteredComments = comments.map(async (comment) => {
      const commentAuthor = await req.app.locals.db.Users.findByPk(
        comment.dataValues.userId,
        {
          attributes: ["username"],
        }
      );
      return { ...comment, username: commentAuthor.dataValues.username };
    });

    res.status(200).json(filteredComments);
  } else {
    res.status(200).json({});
  }
});

// Retrieve the contents of a single drop
router.get("/:dropId", async (req, res) => {
  //res.json("Hello from drops get");
  let dropId = parseInt(req.params.dropId);
  if (isNan(dropId)) {
    res.status(400).end();
    return;
  }

  let dropRecord = await req.app.locals.db.Drops.findByPk(dropId, {
    attributes: [
      "id",
      "title",
      "lang",
      "visibility",
      "text",
      "description",
      "userId",
    ],
  });

  if (dropRecord === null) {
    res.status(404).end();
    return;
  } else if (
    dropRecord.visibility === false &&
    (req.user === undefined || req.user.uid !== dropRecord.dataValues.userId)
  ) {
    res.status(401).end();
    return;
  }

  let annotations = await req.app.locals.db.DropAnnotations.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt", "dropId"],
    },
    where: {
      dropId: dropRecord.dataValues.id,
    },
  });

  const respObject = {
    codeDrop: dropRecord.dataValues,
    dropAnnotations: annotations.map((annotation) => annotation.dataValues),
  };
  res.json(respObject).status(200);
});

// DELETE Routes

// Delete a comment
router.delete("/:dropId/comments/:cId", async (req, res) => {
  const dropId = parseInt(req.params.dropId);
  const commentId = parseInt(req.params.cId);

  if (isNan(dropId) || isNan(commentId)) {
    res.status(400).end();
    return;
  }

  if (user === undefined) {
    res.status(401).end();
    return;
  }

  const commentInstance = await db.Comments.findOne({
    where: { userId: user.uid, dropId: dropId, id: commentId },
  });
  // If the drop does not exist
  if (commentInstance === null) {
    res.status(404).end();
    return;
  } else {
    commentInstance.destroy();
    res.status(200).end();
  }
});

// Remove a star
router.delete("/:dropId/stars", async (req, res) => {
  let dropId = parseInt(req.params.dropId);

  if (req.user === undefined) {
    res.status(401).end();
    return;
  } else if (isNaN(dropId)) {
    res.status(400).end();
    return;
  }

  const starInstance = await req.app.locals.db.Stars.findOne({
    where: { userId: req.user.uid, dropId: dropId },
  });

  // If the star does not exist
  if (starInstance === null) {
    res.status(404).end();
    return;
  }
  await starInstance.destroy();

  // TODO: Reduce user's stars
  const userModel = await req.app.locals.db.Users.findByPk(dropId);
  if (userModel !== null) {
    userModel.numStars -= 1;
    await userModel.save();
  }

  res.status(200).end();
});

// Delete a single drop
router.delete("/:dropId", async (req, res) => {
  let dropId = parseInt(req.params.dropId);
  let user = req.user;

  if (user === undefined) {
    res.status(401).end();
    return;
  } else if (isNan(dropId)) {
    res.status(400).end();
    return;
  }
  let dropModel;

  try {
    dropModel = await req.app.locals.db.Drops.findOne({
      where: { userId: user.uid, id: dropId },
    });
  } catch (error) {
    res.status(500).end();
    return;
  }
  // If the drop does not exist
  if (dropModel === null) {
    res.status(404).end();
    return;
  }

  try {
    await dropModel.destroy();
  } catch (error) {
    console.error(error);
    res.status(500).end();
    return;
  }

  res.status(200).end();
});

router.post("/drop/:dropId/comments", async (req, res) => {
  const commentBody = req.body.text || "";
  const dropId = parseInt(req.params.dropId);

  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  } else if (commentBody.length === 0) {
    res.status(400).end();
    return;
  } else if (isNan(dropId)) {
    res.status(404).end();
    return;
  }

  let dropCount = await req.app.locals.db.Drops.count({
    where: { id: dropId },
  });

  if (dropCount === 0) {
    res.status(404).end();
    return;
  }

  let commentModel = await req.app.locals.db.Comments.create({
    text: commentBody,
    dropId: dropId,
    userId: req.user.uid,
  });
  if (commentModel === null) {
    res.status(500).end();
    return;
  }

  res.status(200).json({ id: commentModel.dataValues.id });
});

router.post("/:dropId/stars", async (req, res) => {
  const dropId = parseInt(req.params.dropId);
  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  } else if (isNaN(dropId)) {
    res.status(400).end();
    return;
  }

  const dropModel = await req.app.locals.db.Drops.findByPk(dropId);

  if (dropModel === null) {
    res.status(404).end();
    return;
  }

  const userModel = await req.app.locals.db.Users.findByPk(dropId);
  if (userModel !== null) {
    userModel.numStars += 1;
    await userModel.save();
  }

  const starModel = await req.app.locals.db.Stars.create({
    dropId: dropId,
    userId: req.user.uid,
  });
  if (starModel === null) {
    res.status(500).end();
    return;
  }

  res.status(200).end();
});

router.post("/drop", async (req, res) => {
  let title = req.body.title;
  let lang = req.body.lang || "";
  let visibility = req.body.visibility;
  let textBody = req.body.text;
  let description = req.body.description || "";
  let annotations = req.body.annotations || [];

  // User is not logged in
  if (req.user === undefined) {
    res.status(401).end();
    return;
  } else if (
    typeof title !== "string" ||
    typeof visibility !== "boolean" ||
    typeof textBody !== "string" ||
    text.length === 0
  ) {
    res.status(400).end();
    return;
  }

  try {
    let dropRecordInfo = await req.app.locals.db.Drops.create({
      title: title,
      lang: lang,
      visibility: visibility,
      text: textBody,
      description: description,
      userId: req.user.uid,
    });
  } catch (error) {
    console.error(error);
    res.send(500).end();
  }

  try {
    annotations.forEach(async (annotation) => {
      await req.app.locals.db.DropAnnotations.create({
        startLine: annotation.start,
        endLine: annotation.end,
        annotation_text: annotation.text,
        dropId: dropRecordInfo.dataValues.id,
        userId: req.user.uid,
      });
    });
    res.status(200).json({ id: dropRecordInfo.dataValues.id });
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

// TODO: Finish
router.put("/drops/:dropId", async (req, res) => {
  const dropId = parseInt(req.params.dropId);
  const title = req.body.title;
  const lang = req.body.lang || "";
  const visibility = req.body.visibility;
  const textBody = req.body.text;
  const description = req.body.description || "";
  const annotations = req.body.annotations || [];
  if (isNan(dropId)) {
    res.status(400).end();
    return;
  } else if (req.user === undefined) {
    res.status(401).end();
    return;
  } else if (
    typeof title !== "string" ||
    typeof visibility !== "boolean" ||
    typeof textBody !== "string" ||
    text.length === 0 ||
    title.length === 0
  ) {
    res.status(400).end();
    return;
  }

  const dropModel = await req.app.locals.db.findOne({
    where: {
      id: dropId,
      userId: req.user.uid,
    },
  });
  if (dropModel === null) {
    res.status(404).end();
    return;
  }
});

router.put("/drops/:dropId/comments/:commentId", async (req, res) => {
  const dropId = parseInt(req.params.dropId);
  const commentId = parseInt(req.params.commentId);
  const commentBody = req.body.text;
  if (
    isNaN(dropId) ||
    isNaN(commentId) ||
    typeof commentBody !== "string" ||
    commentBody.length == 0
  ) {
    res.status(400).end();
    return;
  }

  try {
    const commentModel = await req.app.locals.db.findByPk(commentId);
    if (commentModel === null) {
      res.status(404).end();
    }
    commentModel.text = commentBody;
    await commentModel.save();
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

module.exports = router;
